import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import PomTimer from '../Pomodoro/PomTimer'
import {Link, withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#ff4081'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(({history}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        StudyStyle
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon/>
        </IconButton>
      </Link>
      <Link to="/userprofiles">
        <Button style={isActive(history, "/userprofiles")}>Users</Button>
      </Link>
      <Link to="/calendar">
            <Button style={isActive(history, "/calendar")}>Calendar</Button>
          </Link>
        
      {
        !auth.isAuthenticated() && (<div><div>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
          </div>
          <div>
          <Link to="/search">
            <IconButton aria-label="Search" style={isActive(history, "/search")}>
              <SearchIcon/>
            </IconButton>
          </Link>
        </div>
        </div>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/userprofile/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/userprofile/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</Button>
        </span>)
      }
    <Grid container justifyContent="flex-end">
          <PomTimer />
    </Grid>
    </Toolbar>
  </AppBar>
))

export default Menu
