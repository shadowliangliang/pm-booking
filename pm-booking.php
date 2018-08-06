<?php

//-----------Work with Sessions---------------------------
    if (session_status() == PHP_SESSION_NONE) {
            
        ini_set('session.gc_maxlifetime', 180);
        session_start();
    }
//--------------------------------------------------------


//---Maintenance Mode-------------------------------------

    //$_SESSION['DEVICEID'] = "PD5001";
	
//--------------------------------------------------------

//---Check Authentication---------------------------------

    if( !isset($_SESSION['DEVICEID'])){
        exit( header("HTTP/1.1 401 Unauthorized") ); 
    }
	
//--------------------------------------------------------



//---MySQL Connect----------------------------------------
	
	$my_schema = 'itsm';
		
	$my_con = mysqli_connect(
		'127.0.0.1' , 'dodger' , 'dodger' , $my_schema
	);

//--------------------------------------------------------	



//--------Period JSON Call-----------------------------------------------------

	function period_welcome_call( $POST ){
		
		//---------------------
			
			$period_id 	= $POST['period_id'];
			$device_id 	= $_SESSION['DEVICEID'];
			$authid		= $_SESSION['authid'];
		
			$my_con 	= $GLOBALS['my_con'];
			
		//---------------------
			
			$sql_qry = mysqli_query($my_con, " 
				SELECT 
					period_id,
					period_name,
					period_description,
					period_location,
					period_start,
					period_end,
					period_txt,
					period_submit
					
					FROM period WHERE period_id = $period_id ; 
			" );	
			$sql_row = mysqli_fetch_assoc( $sql_qry );
			
			$obj_in['period_data'] = $sql_row;
		
		//---------------------
			
				$obj_in['booking_status'] = 0;
			
			$sql_qry = mysqli_query($my_con, " SELECT * FROM period_book WHERE period_book_period = $period_id AND period_book_authid = $authid ;" );	
			$sql_num = mysqli_num_rows($sql_qry);
			$sql_row = mysqli_fetch_assoc($sql_qry);
			
			if( $sql_num > 0 ){
				
				$obj_in['booking_status'] = 1;
				$obj_in['booking_data'] = $sql_row;
			}
			
		//---------------------
			
			$json_out = json_encode( $obj_in, JSON_PRETTY_PRINT);
			//echo '<pre>';
			print_r( $json_out );
			
		//---------------------
		
	}
	
//-----------------------------------------------------------------------------


//--------Period JSON Call-----------------------------------------------------

	function period_booking_call( $POST ){
		
		//---------------------
			
			$period_id 	= $POST['period_id'];
			$device_id 	= $_SESSION['DEVICEID'];
		
			$my_con 	= $GLOBALS['my_con'];
			
			$obj_in	= array();
			$obj_in['period_id'] = $period_id;
			$obj_in['device_id'] = $device_id;
			
		//---------------------
			
			$sql_qry = mysqli_query($my_con, " 
				SELECT 
					period_id,
					period_name,
					period_description,
					period_location,
					period_start,
					period_end,
					period_capacity,
					period_state,
					period_nbd
					
					FROM period WHERE period_id = $period_id ; 
			" );	
			$sql_row = mysqli_fetch_assoc( $sql_qry );
			
			$obj_in['period_data'] = $sql_row;
		
		//---------------------
				
			$sql_qry = mysqli_query($my_con, " 
				SELECT
					a.period_timeslot_date,
					a.period_timeslot_id,
					a.period_timeslot_slot,
					a.period_timeslot_capacity,
					
					COUNT(b.period_book_id) as period_timeslot_booked,
					a.period_timeslot_capacity - COUNT(b.period_book_id) as period_timeslot_open
					
					FROM
						period_timeslot a
						
					LEFT JOIN
						period_book b
						ON(period_book_slot = period_timeslot_id )
						
					WHERE 
						a.period_timeslot_period = $period_id
							AND
						a.period_timeslot_relevant = 'true'		
						
					GROUP BY
						a.period_timeslot_id
				;
			" )or die("Error: ".mysqli_error($my_con) ) ;	
			
			while( $sql_row = mysqli_fetch_assoc( $sql_qry )){
			
				$obj_in['period_capa'][ $sql_row['period_timeslot_date'] ] = $sql_row;
			}
			
		//---------------------
		
		//---------------------
			
			$json_out = json_encode( $obj_in, JSON_PRETTY_PRINT);
			//echo '<pre>';
			print_r( $json_out );
			
		//---------------------
		
	}
	
//-----------------------------------------------------------------------------



//--------Book Appointment-----------------------------------------------------

	function booking_slot( $POST ){
		
		print_r($POST);
		
		$DEVICEID  = $_SESSION['DEVICEID'];
		$authid    = $_SESSION['authid'];
		
		$my_con   = $GLOBALS['my_con'];
		$my_table = 'period_book';
		
		$period_id  = $POST['period_id'];
		$nfs_id 	= $POST['nfs_id'];
		
		$hid = $POST['hid'];
		$hit = $POST['hit'];
		$pud = $POST['pud'];
		$put = $POST['put'];
		
		$email = $POST['email'];
		
		$sql_qry = mysqli_query($my_con, " DELETE FROM $my_table WHERE period_book_period = '$period_id' AND period_book_authid = '$authid' ; " );
		
		$sql_qry = mysqli_query($my_con, " 
			
			INSERT INTO $my_table 
				( period_book_period , period_book_slot , period_book_authid , period_book_hid , period_book_hit , period_book_pud , period_book_put ) 
				VALUES( '$period_id' , '$nfs_id' , '$authid' , '$hid' , '$hit' , '$pud' , '$put'  )
			;
		");
		
		if( $email != "" ){
			
			$sql_qry = mysqli_query($my_con, " 
				UPDATE period_authid SET period_authid_contact = '$email' WHERE period_authid_id =  $authid;
			");
		}
		
	}
	
	function booking_cancel($POST){
		
		$DEVICEID  = $_SESSION['DEVICEID'];
		$authid    = $_SESSION['authid'];
		
		$my_con   = $GLOBALS['my_con'];
		$my_table = 'period_book';
		
		$period_id  = $POST['period_id'];
		
		$sql_qry = mysqli_query($my_con, " DELETE FROM $my_table WHERE period_book_period = '$period_id' AND period_book_authid = '$authid' ; " );
		
		echo $period_id . ' - ' . $authid;
	}

//-----------------------------------------------------------------------------






//--------Function Caller------------------------------------------------------
		
	if( isset( $_POST["function"] ) ) {
		
		$_POST["function"]( $_POST );	
	}	
	
	if( isset( $_GET["function"] ) ) {
		
		$_GET["function"]( $_GET );	
	}	
	
//-----------------------------------------------------------------------------

?>