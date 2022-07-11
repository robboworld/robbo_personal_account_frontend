import styled from 'styled-components'

export const Card = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: ${({ theme }) => theme.spaces[4]}px;
`

export const LoginForm = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const SwitchInOut = styled.div`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    letter-spacing: 0.1rem;
`

export const SignIn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: ${({ signIn }) => signIn ? "linear-gradient(to right, #14163c 0%, #03217b 79%)" : "white"};
    color: ${({ signIn }) => signIn ? "white" : "black"};
    box-shadow: ${({ signIn }) => signIn ? "inset -10px -10px 50px black" : "none"};
    border-bottom-right-radius: 10px;
`

export const SignOut = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    cursor: pointer;
    background: ${({ signIn }) => !signIn ? "linear-gradient(to right, #14163c 0%, #03217b 79%)" : "white"};
    color: ${({ signIn }) => !signIn ? "white" : "black"};
    box-shadow: ${({ signIn }) => !signIn ? "inset 10px -10px 50px black" : "none"};
    border-bottom-left-radius: 10px;
`

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80vh;
  width: 30vw;
  background: white;
  opacity: 0.75;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  
  text-transform: uppercase;
  letter-spacing: 0.4rem;
  @media only screen and (max-width: 320px) {
    width: 80vw;
    height: 90vh;
    hr {
      margin-bottom: 0.3rem;
    }
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 360px) {
    width: 80vw;
    height: 90vh;
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 411px) {
    width: 80vw;
    height: 90vh;
  }
  @media only screen and (min-width: 768px) {
    width: 80vw;
    height: 80vh;
  }
  @media only screen and (min-width: 1024px) {
    width: 70vw;
    height: 50vh;
  }
  @media only screen and (min-width: 1280px) {
    width: 30vw;
    height: 80vh;
  }
`

export const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
  color: black;
`

export const Text = styled.p`
  font-size: 16px;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 20%;
  width: 100%;
`

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem;
  width: 70%;
  text-transform: none;
  letter-spacing: 0;
  @media only screen and (min-width: 320px) and (max-width: 768px), (min-width: 1280px){
    flex-direction: column;
    gap: 0.3rem;
  }
`

export const ButtonContainer = styled.div`
  margin: 1rem 0 2rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoginWith = styled.h5`
  cursor: pointer;
`

export const HorizontalRule = styled.hr`
  width: 90%;
  height: 0.3rem;
  border-radius: 0.8rem;
  border: none;
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  background-color: #ebd0d0;
  margin: 1.5rem 0 1rem 0;
  backdrop-filter: blur(25px);
`

export const IconsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 2rem 0 3rem 0;
  width: 80%;
`

export const ForgotPassword = styled.h4`
  cursor: pointer;
  color: black;
`

export const ErrorAlert = styled.div`
  padding: 5%;
  width: 90%;
  // min-height: 5rem;
  background: red;
  border-radius: 10px;
  color: white;
  text-transform: none;
  letter-spacing: 0;
`

export const SuccessAlert = styled.div`
  padding: 5%;
  width: 90%;
  // min-height: 5rem;
  background: green;
  border-radius: 10px;
  color: white;
  text-transform: none;
  letter-spacing: 0;
`