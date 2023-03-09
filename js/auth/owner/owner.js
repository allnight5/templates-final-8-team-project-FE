jQuery(document).ready(function ($) {
    getOwnerMe();
    "use strict";

});

document.querySelector('.img__btn').addEventListener('click', function () {
    document.querySelector('.cont').classList.toggle('s--signup');
});


// 회원가입
function signUp() {
    const username = $('#username').val();
    if (!username) {
        return alert("ID를 입력하세요.")
    }
    const password = $('#password').val();
    if (!password) {
        return alert("비밀번호를 입력하세요.")
    }
    const password2 = $('#password2').val();
    if (!password2) {
        return alert("비밀번호를 확인하세요.")
    }
    const nickName = $('#nickName').val();
    if (!nickName) {
        return alert("닉네임을 입력하세요.")
    }
    const phoneNumber = $('#phoneNumber').val();
    if (!phoneNumber) {
        return alert("휴대폰번호를 입력하세요.")
    }
    const email = $('#email').val();
    if (!email) {
        return alert("이메일을 입력하세요.")
    }

    if (localStorage.getItem('validate') == 1) {
        var settings = {
            "url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/owner/signup",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "username": $('#username').val(),
                "password": $('#password').val(),
                "password2": $('#password2').val(),
                "nickName": $('#nickName').val(),
                "phoneNumber": $('#phoneNumber').val(),
                "email": $('#email').val(),
                "storeName": localStorage.getItem('b_nm'),
                "b_no": localStorage.getItem('b_no'),
                "start_dt": localStorage.getItem('start_dt'),
                "p_nm": localStorage.getItem('p_nm')
            }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            localStorage.removeItem('validate')
            localStorage.removeItem('b_no');
            localStorage.removeItem('b_nm');
            localStorage.removeItem('start_dt');
            localStorage.removeItem('p_nm');
            localStorage.removeItem('verifyEmailCode');
            alert("회원가입 완료")
            document.querySelector('.cont').classList.toggle('s--signup');
            location.reload();
        }).fail(function (response) {
            console.log(response)
            if (response.status === 400) {
                alert(response.responseText)
            }
            console.log(response.responseJSON);
            if (response.responseJSON.statusCode === 409) {
                alert("중복된 ID입니다.")
            } if (response.responseJSON.statusCode === 408) {
                alert("중복된 닉네임입니다.")
            } if (response.responseJSON.statusCode === 407) {
                alert("중복된 이메일입니다.")
            } if (response.responseJSON.statusCode === 406) {
                alert("중복된 휴대폰번호입니다.")
            }
        })
    } else {
        alert("사업자 인증 후 다시 시도하여주세요.")
    }
}



// 로그인
function logIn() {
    var settings = {
        "url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/owner/login",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "username": $('#logInID').val(),
            "password": $('#logInpassword').val()
        }),
    };

    $.ajax(settings).done(function (response, status, xhr) {
        console.log(response);
        console.log(xhr.getResponseHeader('Authorization'))
        localStorage.setItem('accessToken', xhr.getResponseHeader('Authorization'))
        alert("로그인 완료")
        window.location = 'index.html'
    }).fail(function (response) {
        console.log(response.responseJSON);
        if (response.responseJSON.statusCode === 400) {
            alert("ID와 비밀번호를 확인하여주세요.")
        } else {
            alert("ID와 비밀번호를 확인하여주세요.");
        }
    });
}

//로그아웃
function logout() {
    var settings = {
        "url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/owner/logout",
        "method": "DELETE",
        "timeout": 0,
        "headers": {
            "Authorization": localStorage.clear('accessToken')
        },
    };

    $.ajax(settings).done(function (response, status, xhr) {
        console.log(response);
        console.log(status)
        if (status === 403) {
            window.location = "/index.html"
        }
        console.log(response.nickName);
        $('#loginUser').hide();
        $('#mypage').hide();
        $('#MainLogout').hide();
        $('#MainLogin').show();
        $('#MainSignUp').show();
        $('#loginUser').clear(response.nickName + "님 환영합니다.");
    });
}

// 상단 프로필
function getOwnerMe() {
    var settings = {
        "url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/owners",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": localStorage.getItem('accessToken')
        },
    };

    $.ajax(settings).done(function (response, status, xhr) {
        console.log(response);
        console.log(status)
        if (status === 403) {
            window.location.href
        }
        console.log(response.nickName);
        $('#loginUser').show();
        $('#loginUser').append(response.nickName + "님 환영합니다.");
        $('#mypage').hide();
        $('#ownermypage').show();
        $('#MainLogout').show();
        $('#MainLogin').hide();
        $('#MainSignUp').hide();
        $('#adminpage').hide();
    });
}

//이메일 보내기
function sendEmail() {
	var settings = {
		"url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/user/email?email=" + $('#email').val(),
		"method": "POST",
		"timeout": 0,
	};


	$.ajax(settings).done(function (response) {
		var minutes = 2;
		var seconds = 0;
		var interval = setInterval(function () {
			if (seconds === 0 && minutes === 0) {
				clearInterval(interval);
				$('#timer').hide();
				$('#sendEmail3').show();
			} else if (seconds === 0) {
				minutes--;
				seconds = 59;
			} else {
				seconds--;
			}
			if (minutes === 0 && seconds <= 30) {
				document.getElementById("timer").style.color = "red";
			}
			var timeLeft = "남은 시간: " + minutes + "분 " + seconds + "초";
			document.getElementById("timer").innerHTML = timeLeft;
		}, 1000);

		console.log(response);
		alert("이메일이 발송되었습니다.")
		$('#verifyEmail').show();
		$('#verifyEmail2').show();
		$('#sendEmail2').hide();
		$('#sendEmail3').hide();

	}).fail(function (response) {
		console.log(response.responseJSON);
		if (response.responseJSON.status === 404) {
			alert("중복된 이메일입니다. 다른 이메일을 사용하여주세요.")
		}
		if (response.responseJSON.statusCode === 400) {
			alert("잘못된 이메일형식입니다. 다시 한번 확인해주세요.")
		}
	})
}

//이메일 재발송
function sendEmailAgain() {
	var settings = {
		"url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/user/email?email=" + $('#email').val(),
		"method": "POST",
		"timeout": 0,
	};

	$.ajax(settings).done(function (response) {
		$('#timer').show();
		$('#sendEmail3').hide();
		var minutes = 2; // 2분 타이머
		var seconds = 0;
		var interval = setInterval(function () {
			if (seconds === 0 && minutes === 0) {
				clearInterval(interval);
				$('#timer').hide();
				$('#sendEmail3').show();
			} else if (seconds === 0) {
				minutes--;
				seconds = 59;
			} else {
				seconds--;
			}
			if (minutes === 0 && seconds <= 30) {
				document.getElementById("timer").style.color = "red";
			} else {
				document.getElementById("timer").style.color = "black";
			}
			var timeLeft = "남은 시간: " + minutes + "분 " + seconds + "초";
			document.getElementById("timer").innerHTML = timeLeft;
		}, 1000);
		alert("이메일이 발송되었습니다.")
	})
}

//이메일 코드 인증
function verifymail() {
	var settings = {
		"url": "http://ec2-3-36-89-51.ap-northeast-2.compute.amazonaws.com/api/user/verifyCode?code=" + $('#EmailCode').val() + "&email=" + $('#email').val(),
		"method": "POST",
		"timeout": 0,
	};

	$.ajax(settings).done(function (response) {
		if (response == 1) {
			localStorage.setItem('verifyEmailCode', 1)
			alert("이메일 인증에 성공하였습니다.")
			$('#emailOk').show();
			$('#verifyEmail').hide();
			$('#verifyEmail2').hide();
			$('#sendEmail3').hide();
			email.readOnly = true;
		} else {
			localStorage.setItem('verifyEmailCode', 0)
			console.log(response);
			alert("이메일 인증에 실패하였습니다.")
		}
	}).fail(function (response) {
		console.log(response.responseJSON);
		if (response.responseJSON.statusCode === 500) {
			alert("인증에 실패하였습니다. 인증 코드를 확인해주세요")
		} if (response.responseJSON.statusCode === 501) {
			alert("만료된 인증 코드입니다. 재발송 후 다시 시도해주세요.")
		}
	})
}
