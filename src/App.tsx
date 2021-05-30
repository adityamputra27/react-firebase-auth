import React, { FC, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {BrowserRouter, Switch} from 'react-router-dom'
import './App.css';

// Component dan halamannya
import Header from './components/sections/Header'
import SignUp from './components/pages/SignUp'
import SignIn from './components/pages/SignIn'
import ForgotPassword from './components/pages/ForgotPassword'
import Home from './components/pages/Home'
import Dashboard from './components/pages/Dashboard'
import PrivateRoute from './components/auth/PrivateRoute'
import PublicRoute from './components/auth/PublicRoute'
import Loader from './components/UI/Loader'
import firebase from './firebase/config'
import {getUserById, setLoading, setNeedVerification} from './store/actions/authActions'
import {RootState} from './store'

const App: FC = () => {
  const dispatch = useDispatch()
  const {loading} = useSelector((state: RootState) => state.auth)
  
  // Cek jika user ada / exists
  useEffect(() => {
    dispatch(setLoading(true))
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setLoading(true))
        await dispatch(getUserById(user.uid))
        if (!user.emailVerified) {
          dispatch(setNeedVerification())
        }
      }
      dispatch(setLoading(false))
    })
    return () => {
      unsubscribe()
    }
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <PublicRoute path="/" component={Home} exact />
        <PublicRoute path="/signup" component={SignUp} exact />
        <PublicRoute path="/signin" component={SignIn} exact />
        <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
