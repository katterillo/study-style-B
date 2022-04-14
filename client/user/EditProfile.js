import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  span:{
    pointerEvents: "none"
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))

export default function EditProfile({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    goal:'',
    studytime: '',
    genre: '',
    open: false,
    error: '',
    redirectToProfile: false
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, name: data.name, email: data.email, studytime: data.studytime, goal: data.goal, genre: data.genre})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      studytime: values.studytime || undefined,
      goal: values.goal || undefined,
      genre: values.genre || undefined
    }
    update({
      userId: match.params.userId
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, userId: data._id, redirectToProfile: true})
      }
    })
  }

  const [alignment, setAlignment] = React.useState('web');

  const handleChange = name => (event,newAlignment) => {
    console.log("Here");
    console.log(event.target.value);
    console.log(event.currentTarget.value);
    console.log(name);
    if((name === "genre") || (name == "goal")){
    setValues({...values, [name]: event.target.value})
    }
    else{
      setValues({...values, [name]: event.currentTarget.value})
    }
  }

    if (values.redirectToProfile) {
      return (<Redirect to={'/userprofile/' + values.userId}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Edit Study Profile
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <InputLabel id="demo-simple-select-label">When do you prefer to study?</InputLabel> 
          <ToggleButtonGroup
            value={values.studytime}
            exclusive="true"
            fullWidth="true"
            onChange={handleChange('studytime')}
           >
      <ToggleButton value={"N/A"}> N/A</ToggleButton>
      <ToggleButton value={"Morning"}>Morning</ToggleButton>
      <ToggleButton value={"Afternoon"}>Afternoon</ToggleButton>
      <ToggleButton value={"Evening"}>Evening</ToggleButton>
      <ToggleButton value={"Night"}>Night</ToggleButton>
    </ToggleButtonGroup>

      <Box sx={{  minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">What is your main goal?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.goal}
                label="goal"
                onChange={handleChange('goal')}
        >
         
          <MenuItem value={"N/A"}>N/A</MenuItem>
          <ListSubheader>School</ListSubheader>
          <MenuItem value={"Improve my grades"}>Improve my grades</MenuItem>
          <MenuItem value={"Build good study habits"}>Build good study habits</MenuItem>
          <MenuItem value={"Complete my homework"}>Complete my homework</MenuItem>
          <ListSubheader>Concentration</ListSubheader>
          <MenuItem value={"Stay focused for longer periods"}>Stay focused for longer periods</MenuItem>
          <MenuItem value={"Share resources"}>Share resources</MenuItem>
          <MenuItem value={"Be more motivated to study"}>Be more motivated to study</MenuItem>
          <ListSubheader>Group</ListSubheader>
          <MenuItem value={"Find similar users"}>Find similar users</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ m: 1,minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">What genre of music do you most like to listen to while studying?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.genre}
                label="genre"
                onChange={handleChange('genre')}   
        >
          <MenuItem value={"N/A"}>N/A</MenuItem>
          <ListSubheader disableSticky={true}>Classical</ListSubheader>
          <MenuItem value={"orchestral"}>orchestral</MenuItem>
          <MenuItem value={"symphony"}>symphony</MenuItem>
          <MenuItem value={"choral"}>choral</MenuItem>
          <MenuItem value={"opera"}>opera</MenuItem>
          <ListSubheader disableSticky={true}>EDM</ListSubheader>
          <MenuItem value={"happy hardcore"}>happy hardcore</MenuItem>
          <MenuItem value={"house"}>house</MenuItem>
          <MenuItem value={"dubstep"}>dubstep</MenuItem>
          <MenuItem value={"drum and bass"}>drum and bass</MenuItem>
          <MenuItem value={"hardstyle"}>hardstyle</MenuItem>
          <MenuItem value={"speedcore"}>speedcore</MenuItem>
          <ListSubheader disableSticky={true}>Country</ListSubheader>
          <MenuItem value={"bluegrass"}>bluegrass</MenuItem>
          <MenuItem value={"country pop"}>country pop</MenuItem>
          <MenuItem value={"bakersfield sound"}>bakersfield sound</MenuItem>
          <ListSubheader disableSticky={true}>Pop</ListSubheader>
          <MenuItem value={"baroque pop"}>baroque pop</MenuItem>
          <MenuItem value={"pop rock"}>pop rock</MenuItem>
          <MenuItem value={"electropop"}>electropop</MenuItem>
          <MenuItem value={"emo pop"}>emo pop</MenuItem>
          <MenuItem value={"indie pop"}>indie pop</MenuItem>
          <ListSubheader disableSticky={true}>Rap</ListSubheader>
          <MenuItem value={"jazz rap"}>jazz rap</MenuItem>
          <MenuItem value={"trap"}>trap</MenuItem>
          <MenuItem value={"country trap"}>country trap</MenuItem>
          <MenuItem value={"old school"}>old school</MenuItem>
          <ListSubheader disableSticky={true}>Other</ListSubheader>
          <MenuItem value={"lo-fi"}>lo-fi</MenuItem>

        </Select>
      </FormControl>
    </Box>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
}

