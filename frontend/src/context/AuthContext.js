import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ToastContext from "./ToastContext";
import { useLocation } from "react-router-dom";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    

    const {toast} = useContext(ToastContext)
    const navigate = useNavigate()
    const location = useLocation()

    const [user , setUser] = useState(null);
    const [error,setError] = useState(null);

    useEffect(() => {
      checkUserLoggedIn()
    },[])

// $ check if the user is logged in.
const checkUserLoggedIn = async () =>{
    
    try {
        const res = await fetch('http://127.0.0.1:8000/me',{
            method : "GET",
            headers:{
                Authorization : `Bearer ${localStorage.getItem("token")}`,
            }
        })
        const result = await res.json();
        if(!result.error){
            if(
                location.pathname === '/login' ||
                location.pathname === '/register'
            ){
                setTimeout(()=>{
                    navigate('/',{replace:true})
                },1000)
              
            }else {
                navigate(location.pathname ? location.pathname : '/')
            }
            setUser(result);
           
        }else{
            navigate('/login',{replace:true})
        }
    } catch (error) {
        console.log(error)
    }
}

// $ login request 
const loginUser = async(userData) =>{
try {
    const res = await fetch('http://127.0.0.1:8000/login',{
        method: 'POST',
        headers:{
            "content-type": "application/json"
        },
        body: JSON.stringify({...userData})
    });
    const result = await res.json();
   if(!result.error){
    // console.log(result)
    localStorage.setItem("token",result.token) 
    setUser(result.user)
    toast.success(` ${result.user.name} you have Logged in successfully`) 
    
    navigate('/',{replace:true})
    
    }else{
     toast.error(result.error)
   }
} catch (error) {
    console.log(error)
}
}

// $ register request
const registerUser = async (userData) =>{
    try {
        const res = await fetch('http://127.0.0.1:8000/register',{
        method: 'POST',
        headers:{
            "content-type": "application/json"
        },
        body: JSON.stringify({...userData})
    });
    const result = await res.json();
   if(!result.error){
    toast.success('registered successfully! now login into your account')
    navigate('/login', {replace:true});
    }else{
     toast.error(result.error)
   }
    } catch (error) {
        console.log(error)
    }

}

    return (
    <AuthContext.Provider value={{loginUser , registerUser, user , setUser}}>
        {children}
    </AuthContext.Provider>
)
}

export default AuthContext;