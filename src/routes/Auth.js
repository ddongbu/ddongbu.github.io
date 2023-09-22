import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../fbase";
import "../style/Login.css";

const Auth = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event; // 비구조화 할당
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault(); // submit 기본 동작(새로고침) 방지
    try {
      if (newAccount) {
        let data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log("createUserWithEmailAndPassword성공!");
        console.log(data);
      } else {
        let data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        setPersistence(authService, browserSessionPersistence);
        console.log("signInWithEmailAndPassword성공!");
        setUserData(data.user);
        console.log(data);
      }
    } catch (error) {
      //에러처리
      // eslint-disable-next-line default-case
      switch (error.code) {
        case "auth/weak-password":
          setError("비밀번호는 6자리 이상이어야 합니다");
          break;
        case "auth/invalid-email":
          setError("잘못된 이메일 주소입니다");
          break;
        case "auth/email-already-in-use":
          setError("이미 가입되어 있는 계정입니다");
          break;
      }
    }
  };

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider(); // provider 구글 설정
    signInWithPopup(authService, provider); // 팝업창 띄워서 로그인
    setPersistence(authService, browserSessionPersistence)
      .then((data) => {
        setUserData(data.user); // user data 설정
        console.log(data.user); // console에 UserCredentialImpl 출력
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 1.파이어베이스 저장 되어있는 정보를 기반으로 어떤페이지를 가도 유지시킬 수 있게끔.
  // 2.공급업체 별 로그인정보 에러처리(선택)
  // 3.화면 깔끔하게 - 디자인 - 참고 활용 -> (기능 고도화 or 페이지 추가)
  // 4.1번의 완료후 개인정보를 활용  개인화된 정보를 유저별로 볼수있게끔 (장바구니 지원)
  // 5.포트폴리오 < >
  function handleGithubSignIn() {
    const provider = new GithubAuthProvider();
    signInWithPopup(authService, provider);
    setPersistence(authService, browserSessionPersistence)
      .then((data) => {
        setUserData(data.user);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <div className="form signup">
      <div class="form-header">
        <div class="show-signup">
          <p onClick={toggleAccount}>회원가입/로그인</p>
        </div>
      </div>
      <div className="form-elements">
        <form onSubmit={onSubmit}>
          <div className="form-element">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={onChange}
            />
          </div>
          <br></br>
          <div className="form-element">
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={onChange}
            />
          </div>
          <br></br>
          {error}
          <br></br>
          <div className="form-element">
            <input
              type="submit"
              value={newAccount ? "Create Account" : "Sign In"}
            />
          </div>
        </form>
        <div className="form-element">
          <button onClick={handleGoogleLogin}>구글 로그인</button>
        </div>
        <button onClick={handleGithubSignIn}>깃허브 로그인</button>
        <p>로그인 유저: {userData ? userData.displayName : null}</p>
      </div>
    </div>
  );
};

export default Auth;
