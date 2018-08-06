<?php

//-----------Work with Sessions---------------------------
	if (session_status() == PHP_SESSION_NONE) {
		
		ini_set('session.gc_maxlifetime', 180);
		session_start();
	}
//--------------------------------------------------------

//---MySQL Connect----------------------------------------
	
	$my_schema = 'itsm';
		
	$my_con = mysqli_connect(
		'127.0.0.1' , 'dodger' , 'dodger' , $my_schema
	);

//--------------------------------------------------------	

	function auth_do( $POST ){
		
		//---------------------
			
			$period_id = $POST['period_id'];
			
			$device_id   = $POST['device_id'];
			$verify_code = $POST['verify_code'];
		
		//---------------------
			
			$my_con 		= $GLOBALS['my_con'];
			
			$sql_qry = mysqli_query($my_con, " SELECT * FROM period_authid WHERE period_authid_authid = '$device_id' AND period_authid_period = $period_id ; " );	
			$sql_row = mysqli_fetch_assoc( $sql_qry );
			$sql_num = mysqli_num_rows( $sql_qry );
			
			//echo $sql_num; print_r($POST);
			
			if( $sql_num > 0 ){
				$_SESSION['DEVICEID'] = $device_id;
				$_SESSION['authid']   = $sql_row['period_authid_id'];
			}
	}

//--------------------------------------------------------	
	
	function auth_kill(){
		session_destroy();
	}

//--------------------------------------------------------	

	function login_info_call($POST){
		
		$period_id = $POST['period_id'];
		
		$my_con 		= $GLOBALS['my_con'];
		
		//---------------------
		
			$sql_qry = mysqli_query($my_con, " SELECT period_welcome FROM period WHERE period_id = $period_id AND period_state = 'active' ; " )or die("Error: ".mysqli_error($my_con) ) ;	
			$sql_row = mysqli_fetch_assoc( $sql_qry );
			$sql_num = mysqli_num_rows($sql_qry);
			
			if( $sql_num == 0 ){
				$obj_in['period_welcome'] = "Event does not exist or already closed";
				$obj_in['status'] = "0";
			}
			else{
				$obj_in['period_welcome'] = $sql_row['period_welcome'];
				$obj_in['status'] = "1";
			}
			
		//---------------------
			
			$json_out = json_encode( $obj_in, JSON_PRETTY_PRINT);
			//echo '<pre>';
			print_r( $json_out );
			
		//---------------------
	}

//--------------------------------------------------------



//--------Function Caller------------------------------------------------------
		
	if( isset( $_POST["function"] ) ) {
		
		$_POST["function"]( $_POST );	
	}	
	
	if( isset( $_GET["function"] ) ) {
		
		$_GET["function"]( $_GET );	
	}	
	
//-----------------------------------------------------------------------------




?>