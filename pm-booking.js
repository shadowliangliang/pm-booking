
//---Global Vars--------------------------------------

    var app_api  = 'pm-booking.php';
    var auth_api = 'auth.php';

    var view_fw  = [];

    var time_ary  = ["05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
	var eonbd_ary = ["17:00","18:00","19:00","20:00","21:00"];

//----------------------------------------------------

    function IsJsonString( str ) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

//----------------------------------------------------

    function location_reload(){
        setTimeout(function(){
            location.reload();
        },100);
    }

//----------------------------------------------------

    function center_domel( domel , fixed_top ) {
            
                    
        var body_with 		= document.body.offsetWidth;
        var body_height 	= document.body.offsetHeight;
        
        var domel_with 		= domel.offsetWidth;
        var domel_height 	= domel.offsetHeight;
        
        var left 	= (( body_with - domel_with ) / 2 ) / body_with * 100 ;
        var top 	= (( body_height - domel_height ) / 2 ) / body_height * 100 ;
        
                
        domel.style.position 	= "fixed";
        domel.style.left 		= left+"%";
        
        if( fixed_top != undefined ){
            
            domel.style.top 	= fixed_top;
        }
        else{
            domel.style.top 	= top;
        }
    }

//----------------------------------------------------


//---Mod Hashhandler ---------------------------------
	
    var hash_handler = [];

    hash_handler['get'] = function ( hash_key ){

        var hash = window.location.hash.substr(1);
        
        //console.log( hash );
        
        var hash_ary = hash.split('/');
        
                
        var hash_sry_assoc = [];
            
        x = hash_ary.length;

        for( i=0; i < x ; i++ ){
            
            var n = hash_ary[i].indexOf( "=" );
            
            hash_sry_assoc[ hash_ary[i].substring( 0, n) ] = hash_ary[i].substring( n+1 ) ;			
        }		
            
        //console.log( hash_sry_assoc );
        
        var hash_result = hash_sry_assoc[ hash_key ];
        //console.log( hash_result );
        
        return hash_result;	
    }

//-----------------------------

    hash_handler['set'] = function ( hash_key , hash_val ){
		
		if( window.location.hash == "" ){
			var hash_result = hash_key + "=" + hash_val;
		}
		else{
			
		
			if( hash_handler['get']( hash_key ) == undefined ){
				
				var hash = window.location.hash.substr(1) + "/" + hash_key + "=";
				
			}
			else{
				var hash = window.location.hash.substr(1);
			}
			
			//console.log( hash );
			
			var hash_ary = hash.split('/');
			
					
			var hash_sry_assoc = [];
				
			x = hash_ary.length;

			for( i=0; i < x ; i++ ){
				
				var n = hash_ary[i].indexOf( "=" );
				
								
				if( hash_ary[i].substring( 0, n) == hash_key ){
					
					hash_sry_assoc[ hash_ary[i].substring( 0, n) ] =  hash_val ;			
				}
				else{
					hash_sry_assoc[ hash_ary[i].substring( 0, n) ] = hash_ary[i].substring( n+1 ) ;	
				}
			}		
				
			console.log( hash_sry_assoc );
			
			var hash_result = '';
			
			i = 1;
			for ( var prop in hash_sry_assoc ) {
				
				hash_result = hash_result + prop + '=' + hash_sry_assoc[prop] ;
				
				if( i < x ){
					hash_result = hash_result + '/'
				}
				
				i++
			}
			
		}
		
		console.log( hash_result );
		return hash_result;	
	}

//----------------------------------------------------------
	
    function form_post( url , data , follow_function ){
            
        var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if ( this.readyState === 4 ) {
                    
                    console.log(this.responseText);
                    var header_code = this.status;
                //------------------------------------------
                    if( header_code.toString() == 401 ){
                    
                        login_frame_call();
                        return false;
                    }
                //------------------------------------------
                    if( header_code.toString()[0] == 2 ){
                        
                        var obj = null;
                        
                        if( IsJsonString( this.responseText ) == true ){ 
                            
                            var obj = JSON.parse( this.responseText );	
                        }
                        
                        if( follow_function != undefined ){
                            follow_function( obj );
                        }
                    }
                    else{
                        alert("Something went wrong in function " + data.get("function") + " with error code " + this.status );
                    }
                //------------------------------------------
                }
            });
            xhr.open("POST", url );
            xhr.setRequestHeader("Cache-Control", "no-cache");

            xhr.send(data);
    }

//----------------------------------------------------------

//-------------------------------------------------

    function exit_func(msg){

        var mainres = document.getElementById("mainres");

        var msgbox = document.createElement("DIV");
            msgbox.classList.add("msgbox");
            msgbox.innerHTML = msg;
        mainres.appendChild(msgbox);
                
        return null;
    }

//-------------------------------------------------

    function head_build(){

        var headblock = document.createElement("DIV");
            headblock.classList.add("headblock");

            var hl_logo = document.createElement("DIV");
                hl_logo.setAttribute("hl_logo" , "1");
            headblock.appendChild(hl_logo);

                var hl_logo_img = document.createElement("IMG");
                    hl_logo_img.src = "gfx/dlh_logo_txt_white_hl.png";
                hl_logo.appendChild(hl_logo_img);
            
            var hl_txt = document.createElement("DIV");
                hl_txt.setAttribute("hl_txt" , "1");
                hl_txt.innerHTML = "EFB Patch Management - Appointment Booking";
            headblock.appendChild(hl_txt);

            var lo_btn = document.createElement("SPAN");
                lo_btn.setAttribute("lo_btn" , "1");
                lo_btn.innerHTML = "logoff";
                lo_btn.onclick = function(){

                    var data = new FormData();
                    data.append("function", "auth_kill");
                    form_post( auth_api , data , location_reload );   
                }

            headblock.appendChild(lo_btn);

        document.body.appendChild(headblock);
    }
	
//-------------------------------------------------

    function footer_build(){

        var footer = document.createElement("DIV");
        footer.classList.add("footer");
		document.body.appendChild(footer);
		footer.innerHTML = "<b>Lufthansa opsITservices:</b> &emsp; Monday - Sunday 6.00 am - 9.30 pm &emsp; | &emsp; mail opsitmuc@dlh.de &emsp; | &emsp; phone +49 69696 92 999";
	}

//-------------------------------------------------

    function login_frame_call(){

        var lf = document.createElement("DIV");
            lf.classList.add("login_frame");
            lf.onkeydown = function(ev){
                if (ev.keyCode === 13) {
                    document.getElementById("login_submit_btn").click();
                }
            }

        //--------------------
            var lf_hl = document.createElement("DIV");
            lf_hl.id = "login_info_target";
            lf_hl.setAttribute("lf_hl" , "1" );
            //lf_hl.innerHTML = "Please Login via your device ID";

            lf.appendChild(lf_hl);
        //--------------------
            var lf_input = document.createElement("INPUT");
            lf_input.type = "text";   
            lf_input.id = "device_id_input";
            lf_input.placeholder = "Device ID";

            lf.appendChild(lf_input);   
        //--------------------
            var lf_input = document.createElement("INPUT");
            lf_input.type = "password";    
            lf_input.id = "verify_code_input";
            lf_input.placeholder = "Verification Code";

            lf.appendChild(lf_input);
        //--------------------
            var lf_btn = document.createElement("BUTTON");
            lf_btn.id = "login_submit_btn";
            lf_btn.innerHTML = "login";
            lf.appendChild(lf_btn);

            lf_btn.onclick = function(){ auth_init(); } 
        //--------------------
        
            var period_id = hash_handler['get']("period_id");
            
            var data = new FormData();
                data.append("function", "login_info_call");
                data.append("period_id", period_id);

            form_post( auth_api , data , login_info_append );
        
        //--------------------


        document.body.appendChild(lf);
        center_domel( lf , "20vh" );
    }

//--------------------
    
    function login_info_append(obj){
        
        var login_info_target = document.getElementById("login_info_target");
		login_info_target.innerHTML = obj.period_welcome;
		
		if( obj.status == "0" ){
		
			var login_frame = login_info_target.parentNode;
			//login_frame.depend(login_info_target);
			login_frame.innerHTML = "";
			login_frame.appendChild(login_info_target);
		}
    }

//--------------------

    function auth_init(){

        var device_id_input     = document.getElementById("device_id_input");
        var verify_code_input  = document.getElementById("verify_code_input");

        var device_id   = device_id_input.value;
        var verify_code = verify_code_input.value;
        
        domel_ary = ["device_id_input" , "verify_code_input" ];
        for(var prop in domel_ary ){
            
            var is_domel = document.getElementById( domel_ary[prop] );
            if( is_domel.value == "" ){
                var val_chk = 1;
                is_domel.style.border = "1px solid #c31b1b";
                is_domel.onclick = function(){
                    this.style.border = "1px solid #AAA";
                }
            }
        }

        if( val_chk == 1 ){ return null; }
        
        var period_id = hash_handler['get']("period_id");
        
        var data = new FormData();
        data.append("function", "auth_do");
        data.append("period_id", period_id);
        data.append("device_id", device_id);
        data.append("verify_code", verify_code);

        form_post( auth_api , data , location_reload );   
    }

//-------------------------------------------------

    function view_call(){

        var view = hash_handler['get']("view");
        if( view == undefined ){
            var view = "welcome";
            location.href = "#" + hash_handler['set'] ( "view" , view );
        }

        var period_id = hash_handler['get']("period_id");
            
        if(period_id == undefined ){
            exit_func("URL must contain a valid Patch Management Period ID.");
			return null;
        }
		else{
			view_fw[view]();
		}
	}

//---------------------------------------------------------------------

    view_fw["welcome"] = function(){

        var period_id = hash_handler['get']("period_id");
        
        var data = new FormData();
            data.append("function", "period_welcome_call");
            data.append("function", "period_welcome_call");
            data.append("period_id", period_id);

        form_post( app_api , data , welcome_build );
    }
	
//------------------------------------

	function welcome_build(obj){
		
		//---------------------
            head_build();
			footer_build();
		//---------------------
            var topres  = document.getElementById("topres");
            var mainres = document.getElementById("mainres");
			var subres  = document.getElementById("subres");
			
			topres.innerHTML = "";
			mainres.innerHTML = "";
			subres.innerHTML = "";
        //---------------------
			
			if( obj.booking_status == "1" ){
				
				//---------------------
					
					var msgbox = document.createElement("DIV");
					msgbox.classList.add("msgbox");
					msgbox.innerHTML = "You have successfully booked the following service appointment";
					//topres.appendChild(msgbox);
				
				//---------------------
				
					var bb = document.createElement("TABLE");
					bb.classList.add("booking_block");
					mainres.appendChild(bb);
				
				//---------------------
					var bb_tr = document.createElement("TR");
					bb.appendChild(bb_tr);

					var bb_hl_ary = ["hand-in date" , "hand-in time" , "pickup date" , "pickup time" , "booking"];
					var bb_st_ary = ["period_book_hid" , "period_book_hit" , "period_book_pud" , "period_book_put"];
					
					for(var prop in bb_hl_ary){
						
						var bb_th = document.createElement("TH");
						bb_th.innerHTML = bb_hl_ary[prop]; 
						bb_tr.appendChild(bb_th);
					}
				//---------------------

					var bb_tr = document.createElement("TR");
					bb.appendChild(bb_tr);
					
					for(var prop in bb_st_ary){
						
						var bb_td = document.createElement("TD");
						bb_td.style.cursor = "auto";
						bb_td.innerHTML = obj.booking_data[ bb_st_ary[prop] ]; 
						bb_tr.appendChild(bb_td);
					}
					
						var bb_td = document.createElement("TD");
						bb_td.style.cursor = "auto";
						bb_td.style.padding = "1px";
						bb_td.style.width = "230px";
						bb_tr.appendChild(bb_td);
						
						//----------------
						
							var btn = document.createElement("BUTTON");
							btn.innerHTML = "rebook";
							bb_td.appendChild(btn);
							
							btn.onclick = function(){
								location.href = "#" + hash_handler['set'] ( "view" , "booking" );
								view_call();
							}
							
						//----------------
							
							var btn = document.createElement("BUTTON");
							btn.innerHTML = "cancel";
							bb_td.appendChild(btn);
							btn.onclick = function(){
								
								var chk = confirm("Do you really want to cancel your booking?");
								if (chk == true) {
									
									var data = new FormData();
									data.append("function", "booking_cancel");
									data.append("period_id", obj.period_data.period_id);

									form_post( app_api , data , view_call );
									
								}
							}
							
						//----------------
					
				//----------------
					subres.innerHTML = obj.period_data.period_submit;
				//----------------
							
			}
			else{
				
				//----------------
					mainres.innerHTML = obj.period_data.period_txt;
				//----------------
				
					var btn = document.createElement("BUTTON");
					btn.classList.add("main_btn");
					btn.innerHTML = "book service appointment";
					subres.appendChild(btn);
							
					btn.onclick = function(){
						location.href = "#" + hash_handler['set'] ( "view" , "booking" );
						view_call();
					}
				//----------------
			}
			
        //---------------------
	}
	
//---------------------------------------------------------------------
	
	view_fw["booking"] = function(){
		
		var period_id = hash_handler['get']("period_id");
        
        var data = new FormData();
            data.append("function", "period_booking_call");
            data.append("period_id", period_id);

        form_post( app_api , data , booking_build );

	}
	
//------------------------------------

    function booking_build(obj){
        
        //---------------------
            head_build();
            window.tmp_obj = obj;
        //---------------------
            var topres  = document.getElementById("topres");
            var mainres = document.getElementById("mainres");
			var subres  = document.getElementById("subres");
			
			topres.innerHTML = "";
			mainres.innerHTML = "";
			subres.innerHTML = "";
        //---------------------
            //topres.innerHTML = obj.period_data.period_txt;
        //---------------------

            var bb = document.createElement("TABLE");
            bb.classList.add("booking_block");
            mainres.appendChild(bb);

            //---------------------
                var bb_tr = document.createElement("TR");
                bb.appendChild(bb_tr);

                var bb_hl_ary = ["hand-in date" , "hand-in time" , "pickup date" , "pickup time" , "email address" , "booking"]
                
                for(var prop in bb_hl_ary){
                    
                    var bb_th = document.createElement("TH");
                    bb_th.innerHTML = bb_hl_ary[prop]; 
                    bb_tr.appendChild(bb_th);
                }
            //---------------------

                var bb_tr = document.createElement("TR");
                bb.appendChild(bb_tr);
            
            //---------------------

                var bb_td = document.createElement("TD");
                bb_td.id = "hand_in_date"; 
                bb_td.innerHTML = "click to select";
                bb_tr.appendChild(bb_td);
                bb_td.onclick = function(){
                    
                    var spt_date  = obj.period_data.period_start.split("-")
                    var year_fw   = spt_date[0];
                    var month_fw  = spt_date[1];

                    date_select_call( year_fw , month_fw , "hid" , this);
                }

            //---------------------
                
                var bb_td = document.createElement("TD");
                bb_tr.appendChild(bb_td);
               
                    var bb_td_dd = document.createElement("select");
                    bb_td_dd.id = "hand_in_time"; 
                    bb_td.appendChild(bb_td_dd);

                        var bb_td_dd_opt = document.createElement("option");
                        bb_td_dd.appendChild(bb_td_dd_opt);
                        bb_td_dd_opt.innerHTML = "optional";
                        bb_td_dd_opt.value = "";

                    for(var prop in time_ary){
                        
                        var bb_td_dd_opt = document.createElement("option");
                        bb_td_dd.appendChild(bb_td_dd_opt);
                        bb_td_dd_opt.innerHTML = time_ary[prop];
                        bb_td_dd_opt.value = time_ary[prop];
                    }

            //---------------------
                
                var bb_td = document.createElement("TD");
                bb_td.id = "pickup_date"; 
                bb_td.innerHTML = "click to select";
                bb_tr.appendChild(bb_td);
                bb_td.onclick = function(){
                    
                    var hid = document.getElementById("hand_in_date"); 
                    
                    if( hid.getAttribute("hid") == undefined ){
                        
                        hid.style.borderColor = "red";
                        return null;
                    }
                    
                    var spt_date  = hid.getAttribute("hid").split("-")
                    var year_fw   = spt_date[0];
                    var month_fw  = spt_date[1];

                    date_select_call( year_fw , month_fw , "pud" , this);
                }

            //---------------------
                
                var bb_td = document.createElement("TD");
                bb_tr.appendChild(bb_td);
               
                    var bb_td_dd = document.createElement("select");
                    bb_td_dd.id = "pickup_time"; 
                    bb_td.appendChild(bb_td_dd);

                        var bb_td_dd_opt = document.createElement("option");
                        bb_td_dd.appendChild(bb_td_dd_opt);
                        bb_td_dd_opt.innerHTML = "optional";
                        bb_td_dd_opt.value = "";
                    
            //---------------------
			    
                var bb_td = document.createElement("TD");
                bb_tr.appendChild(bb_td);
               
                    var bb_td_ip = document.createElement("input");
                    bb_td_ip.id = "email_address"; 
                    bb_td_ip.placeholder = "email for status update";
					bb_td.appendChild(bb_td_ip);
					bb_td.style.padding = "2px";
 
            //---------------------
			
				var bb_td = document.createElement("TD");
                bb_tr.appendChild(bb_td);
					
					var btn = document.createElement("BUTTON");
					btn.innerHTML = "book";
					bb_td.appendChild(btn);
					
					btn.onclick = function(){
						
						var period_id = obj.period_id;
						
						var hid_domel   = document.getElementById("hand_in_date");
						var hit_domel   = document.getElementById("hand_in_time");
						
						var pud_domel   = document.getElementById("pickup_date");
						var put_domel   = document.getElementById("pickup_time");
						
						var email_domel = document.getElementById("email_address");
						
						
						var hid = hid_domel.getAttribute("hid");
						var nfs_id = hid_domel.getAttribute("nfs_id");
						var pud = pud_domel.getAttribute("pud");
						
						var hit = hit_domel.value;
						var put = put_domel.value;
						
						
						var email = email_domel.value;
						
						if( hid == undefined ){
							hid_domel.style.borderColor = "red";
							return null;
						}
						if( pud == undefined ){
							pud_domel.style.borderColor = "red";
							return null;
						}
						
						
						var data = new FormData();
						data.append("function", "booking_slot");
						data.append("period_id", period_id );
						data.append("nfs_id", nfs_id );
						data.append("hid", hid );
						data.append("hit", hit );
						data.append("pud", pud );
						data.append("put", put );
						data.append("email", email );
						
						location.href = "#" + hash_handler['set'] ( "view" , "welcome" );
						
						form_post( app_api , data , view_fw["welcome"] );   
						
					}
				
			//---------------------
			
        //---------------------
    
    }

//---------------------------------------------------------------------

    var wd_ary = [];
    wd_ary[0] = "Mo";  
    wd_ary[1] = "Tu";  
    wd_ary[2] = "We";  
    wd_ary[3] = "Th";  
    wd_ary[4] = "Fr";  
    wd_ary[5] = "Sa";  
    wd_ary[6] = "Su";        

    var md_ary = [];
    md_ary[1]   = "01";
    md_ary[2]   = "02";
    md_ary[3]   = "03";
    md_ary[4]   = "04";
    md_ary[5]   = "05";
    md_ary[6]   = "06";
    md_ary[7]   = "07";
    md_ary[8]   = "08";
    md_ary[9]   = "09";
    md_ary[10]  = "10";
    md_ary[11]  = "11";
    md_ary[12]  = "12";
    md_ary[13]  = "13";
    md_ary[14]  = "14";
    md_ary[15]  = "15";
    md_ary[16]  = "16";
    md_ary[17]  = "17";
    md_ary[18]  = "18";
    md_ary[19]  = "19";
    md_ary[20]  = "20";
    md_ary[21]  = "21";
    md_ary[22]  = "22";
    md_ary[23]  = "23";
    md_ary[24]  = "24";
    md_ary[25]  = "25";
    md_ary[26]  = "26";
    md_ary[27]  = "27";
    md_ary[28]  = "28";
    md_ary[29]  = "29";
    md_ary[30]  = "30";
    md_ary[31]  = "31";

    var mn_ary = [];
    mn_ary[0]  = ["01" , "January"];  
    mn_ary[1]  = ["02" , "February"];  
    mn_ary[2]  = ["03" , "March"];  
    mn_ary[3]  = ["04" , "April"];  
    mn_ary[4]  = ["05" , "May"];  
    mn_ary[5]  = ["06" , "June"];  
    mn_ary[6]  = ["07" , "July"];     
    mn_ary[7]  = ["08" , "August"];  
    mn_ary[8]  = ["09" , "September"];  
    mn_ary[9]  = ["10" , "October"];  
    mn_ary[10] = ["11" , "November"];  
    mn_ary[11] = ["12" , "December"];

//-----------------------------------

    function date_select_call( y_nr , m_nr , type , target ){

        //-----------------------------------

            obj = window.tmp_obj.period_capa;
            //delete window.tmp_obj;
            //console.log(obj);

        //-----------------------------------

            var ds_date_frame = document.getElementById("ds_date_frame");
            if( ds_date_frame != undefined ){
                ds_date_frame.parentNode.removeChild(ds_date_frame);
            }

        //-----------------------------------
            
            var date_in = new Date( y_nr + "-" + m_nr + "-01" );
            
            /*var date_in = new Date( );
            date_in.setDate(1);
            date_in.setMonth(m_nr);
            date_in.setFullYear(y_nr);
            */

            var fd_m = new Date(date_in.getFullYear(), date_in.getMonth(), 1);
            var ld_m = new Date(date_in.getFullYear(), date_in.getMonth() + 1, 0);

            var day = fd_m.getDay();
            var fd_fw = new Date(fd_m.getFullYear(), fd_m.getMonth(), fd_m.getDate() + (day == 0?-6:1)-day );
           
            var day = ld_m.getDay();
            var ld_lw = new Date(ld_m.getFullYear(), ld_m.getMonth(), ld_m.getDate() + (day == 0?0:7)-day );
            
            var oneday = 24*60*60*1000; // hours*minutes*seconds*milliseconds

            var day_diff = Math.round(Math.abs((fd_fw.getTime() - ld_lw.getTime())/(oneday)));

            //console.log(fd_m +"\n"+ ld_m +"\n"+ fd_fw +"\n"+ ld_lw +"\n"+ day_diff);
        //-----------------------------------

            var df = document.createElement("DIV");
            df.id = "ds_date_frame";
            df.classList.add("date_frame");
            document.body.appendChild(df);
            center_domel(df , "16vh");
            
            var df_x = document.createElement("DIV");
            df_x.setAttribute("df_x" , "1");
            df_x.innerHTML = "X";
            df.appendChild(df_x);
            df_x.onclick = function(){

                var ds_date_frame = document.getElementById("ds_date_frame");
                ds_date_frame.parentNode.removeChild(ds_date_frame);
            }


            var df_hl = document.createElement("DIV");
            df_hl.setAttribute("df_hl" , "1");
            df.appendChild(df_hl);
        
        //-------------------------

            var df_hl_bw = document.createElement("DIV");
            df_hl_bw.setAttribute("df_hl_arrow" , "1");
            df_hl_bw.innerHTML =  "<";
            df_hl.appendChild(df_hl_bw);

            var tmp_date_bw = new Date( fd_m );
            tmp_date_bw.setMonth(tmp_date_bw.getMonth() -1 );

            var tmp_month_bw = tmp_date_bw.getMonth();
            tmp_month_bw = mn_ary[tmp_month_bw][0];

            df_hl_bw.setAttribute("year" , tmp_date_bw.getFullYear() );
            df_hl_bw.setAttribute("month" , tmp_month_bw );
            df_hl_bw.onclick = function(){
                
                var y_nr = this.getAttribute("year");
                var m_nr = this.getAttribute("month");

                date_select_call( y_nr , m_nr , type , target );
            }
        
        //-------------------------   
            
            var df_hl_m = document.createElement("DIV");
            df_hl_m.setAttribute("df_hl_txt" , "1");
            //df_hl_m.style.backgroundColor = "#000";
            df_hl_m.innerHTML =  mn_ary[ ld_m.getMonth() ][1] + " " + ld_m.getFullYear();
            df_hl.appendChild(df_hl_m);
            
        //-------------------------

            var df_hl_fw = document.createElement("DIV");
            df_hl_fw.setAttribute("df_hl_arrow" , "1");
            df_hl_fw.innerHTML =  ">";
            df_hl.appendChild(df_hl_fw);

            var tmp_date_fw = new Date( fd_m );
            tmp_date_fw.setMonth(tmp_date_fw.getMonth() + 1);

            var tmp_month_fw = tmp_date_fw.getMonth();
            tmp_month_fw = mn_ary[tmp_month_fw][0];

            df_hl_fw.setAttribute("year" , tmp_date_fw.getFullYear() );
            df_hl_fw.setAttribute("month" , tmp_month_fw );
            df_hl_fw.onclick = function(){
                
                var y_nr = this.getAttribute("year");
                var m_nr = this.getAttribute("month");

                date_select_call( y_nr , m_nr , type , target );
            }
        
        //-----------------------------------
         
            for (var prop in wd_ary ) {
                var df_dhl = document.createElement("DIV");
                df_dhl.setAttribute("df_dhl" , "1");
                df_dhl.innerHTML = wd_ary[prop];
                df.appendChild(df_dhl);
            }

        //-----------------------------------

            var date_count = fd_fw;

            for (var i = 0; i <= day_diff; i++) {
                
                var df_db = document.createElement("DIV");
                df_db.setAttribute("df_dboff" , "1");
                df_db.setAttribute("date_box" , "1");
                df_db.innerHTML = md_ary[ date_count.getDate() ];
                df.appendChild(df_db);
                

                var chk_day = date_count.getDate();
                chk_day = md_ary[chk_day];

                var chk_month = date_count.getMonth();
                chk_month = mn_ary[chk_month][0];

                var chk_year = date_count.getFullYear();

                var date_str = chk_year + "-" + chk_month + "-" + chk_day ;
                df_db.setAttribute("date_str" , date_str);
                
                //console.log(date_str);
                
                /*
                if( obj[date_str] != undefined ){
                    
                    if( obj[date_str].open > 0 ){
                        df_db.setAttribute("df_db" , "1");

                        df_db.setAttribute("is_year" , date_count.getFullYear() );
                        df_db.setAttribute("is_month" , date_count.getMonth() );
                        df_db.setAttribute("is_day" , date_count.getDate() );
                        df_db.onclick = function(){
                            
                            var is_year  = this.getAttribute("is_year");

                            var is_month = this.getAttribute("is_month");
                            is_month = mn_ary[is_month][0];
                            
                            var is_day   = this.getAttribute("is_day");
                            is_day = md_ary[is_day];
                            
                            target.innerHTML = is_year + "-" + is_month + "-" + is_day;
                            target.setAttribute("hid" , is_year + "-" + is_month + "-" + is_day );
                            target.style.borderColor = "#AAA";

                            var ds_date_frame = document.getElementById("ds_date_frame");
                            ds_date_frame.parentNode.removeChild(ds_date_frame);
                        }
                    }
                    else{
                        df_db.setAttribute("df_dboff" , "1");
                    }
                }
                else{
                    df_db.setAttribute("df_dboff" , "1");
                }
                */

                /*
                if( date_count.getMonth() != fd_m.getMonth() ){
                    df_db.setAttribute("df_dboff" , "1");
                }
                else{
                    df_db.setAttribute("df_db" , "1");

                    df_db.setAttribute("is_year" , date_count.getFullYear() );
                    df_db.setAttribute("is_month" , date_count.getMonth() );
                    df_db.setAttribute("is_day" , date_count.getDate() );
                    df_db.onclick = function(){
                        
                        var is_year  = this.getAttribute("is_year");
                        var is_month = this.getAttribute("is_month");
                        var is_day   = this.getAttribute("is_day");

                        target.innerHTML = is_year + "-" + is_month + "-" + is_day;

                        var ds_date_frame = document.getElementById("ds_date_frame");
                        ds_date_frame.parentNode.removeChild(ds_date_frame);
                    }
                }
                */
                date_count.setDate(date_count.getDate() + 1);
            }

        //-----------------------------------
            
            set_date_box[type]( target );

        //-----------------------------------
    }

//-------------------------------------------------

    var set_date_box = [];
    
    set_date_box["hid"] = function( target ){

        var obj = window.tmp_obj;
		
		var p_start = obj.period_data.period_start;
		var p_end = obj.period_data.period_end;
		
		var psd = new Date( p_start );
		var ped = new Date( p_end );
		
		var date_count = new Date(p_start);
		var is_date = date_count.getFullYear() + "-" + mn_ary[ date_count.getMonth() ][0] + "-" + md_ary[ date_count.getDate() ] ;
		
		/*
		console.log(p_start);
		console.log(p_end);
		console.log(is_date);
		*/
		
		while ( is_date < p_end ) {
			
			var is_date = date_count.getFullYear() + "-" + mn_ary[ date_count.getMonth() ][0] + "-" + md_ary[ date_count.getDate() ] ;
			
			var ds_date_frame = document.getElementById("ds_date_frame");
			var date_box_sel = ds_date_frame.querySelectorAll('[date_str="'+is_date+'"]');
			
			
		//------------------------------
			
			var chk_free_slot = false;
			var next_free_slot = null;
			
			for( var prop in obj.period_capa ){
				
				if( prop > is_date && obj.period_capa[prop].period_timeslot_open > 0 ){
					chk_free_slot = true;
					nfs_id 		  = obj.period_capa[prop].period_timeslot_id;
					nfs_date 	  = prop;
					break;
				}
			}
			
			//console.log( is_date + " -> " + chk_free_slot + ' -> ' + nfs_id );
		
		//------------------------------
		 
			
			if( date_box_sel.length > 0 && chk_free_slot == true ){
			
				var is_date_box = date_box_sel[0];
				
				is_date_box.removeAttribute("df_dboff");
                is_date_box.setAttribute("df_db" , "1");
				
				is_date_box.setAttribute("nfs_id" , nfs_id);
				is_date_box.setAttribute("nfs_date" , nfs_date);

                is_date_box.onclick = function(){
                        
                    var date_str = this.getAttribute("date_str");
					var nfs_id   = this.getAttribute("nfs_id");
					var nfs_date = this.getAttribute("nfs_date");
                        
					target.innerHTML = date_str;
					
					target.setAttribute("hid" , date_str );
					target.setAttribute("nfs_id" , nfs_id );
					target.setAttribute("nfs_date" , nfs_date );
					
					target.style.borderColor = "#AAA";

					var ds_date_frame = document.getElementById("ds_date_frame");
					ds_date_frame.parentNode.removeChild(ds_date_frame);
                }
			}
			
			date_count.setDate(date_count.getDate() + 1);
		}
    } 

//--------------------------------------------------------

    set_date_box["pud"] = function( target ){

        var nbd_sla  = window.tmp_obj.period_data.period_nbd;
		var hid 	 = document.getElementById("hand_in_date").getAttribute("hid");
		var nfs_id 	 = document.getElementById("hand_in_date").getAttribute("nfs_id");
		var nfs_date = document.getElementById("hand_in_date").getAttribute("nfs_date");
		
        console.log(nbd_sla + " - " + hid + " - " + nfs_id  + " - " + nfs_date );
		
		
		var ds_date_frame = document.getElementById("ds_date_frame");
		var date_box_ary = ds_date_frame.querySelectorAll('[date_box="1"]');
		
		console.log( date_box_ary.length );
		
		var x = date_box_ary.length;
		for (var i = 0; i < x ; i++) {
			
			var is_date_box = date_box_ary[i];
			var is_date = is_date_box.getAttribute("date_str");
			
			if( is_date >= nfs_date ){
				
				is_date_box.removeAttribute("df_dboff");
                is_date_box.setAttribute("df_db" , "1");
				
				//------------------------
					if( is_date == nfs_date ){
						
						//is_date_box.style.border = "1px solid #ff9900";
						is_date_box.onmouseover = function(){
							
							var pos_left = this.offsetLeft;
							var pos_top  = this.offsetTop;
							console.log(pos_left + " - " + pos_top);
						
							var note_box = document.createElement("DIV");
							note_box.id = "eonbd_note";
							note_box.innerHTML = "Note: Pickup after 5pm";
							note_box.classList.add("note_box");
							note_box.style.top = (pos_top - 30) + "px";
							note_box.style.left = (pos_left - 30) + "px";
							
							ds_date_frame = document.getElementById("ds_date_frame");
							ds_date_frame.appendChild(note_box);
						}
						
						is_date_box.onmouseout = function(){
							document.getElementById("eonbd_note").parentNode.removeChild( document.getElementById("eonbd_note") );
						}
					}
				//------------------------
				
				is_date_box.onclick = function(){
                        
                    var date_str = this.getAttribute("date_str");
					target.innerHTML = date_str;
					target.setAttribute("pud" , date_str );
					
					var put = document.getElementById("pickup_time");
					put.innerHTML = "";
					
					//--------------
						if( date_str == nfs_date ){
							
							var is_time_ary = eonbd_ary;
						}
						else{
							is_time_ary = time_ary;
						}
					//--------------
					
						var put_opt = document.createElement("OPTION");
						put_opt.innerHTML = "optional";
						put_opt.value = "";
						
						put.appendChild(put_opt);
					
					
					for( prop in is_time_ary ){
						
						var put_opt = document.createElement("OPTION");
						put_opt.innerHTML = is_time_ary[prop];
						put_opt.value = is_time_ary[prop];
						
						put.appendChild(put_opt);
					}
					
					target.style.borderColor = "#AAA";

					var ds_date_frame = document.getElementById("ds_date_frame");
					ds_date_frame.parentNode.removeChild(ds_date_frame);
                }
			}
			
		}
    }

//--------------------------------------------------------
	
	