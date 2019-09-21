import React, {Component} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import AppIcon from "../images/icon.png";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import {connect} from "react-redux";
import {signupUser} from "../redux/actions/userActions";

const styles = theme => ({...theme.spreadIt});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      handle: "",
      errors: {}
    };
  }

  //   static getDerivedStateFromProps(nextProps, prevState){
  //     if (nextProps.externalList !== prevState.list) {
  //         return { list: nextProps.externalList };
  //     }
  //     else return null; // Triggers no change in the state
  // }
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) {
      return {errors: nextProps.UI.errors};
    } else return null; // Triggers no change in the state
  }
  //   componentWillReceiveProps(nextProps) {
  //     if (nextProps.UI.errors) {
  //       this.setState({errors: nextProps.UI.errors});
  //     }
  //   }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({loading: true});
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    };
    this.props.signupUser(newUserData, this.props.history);
  };
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  render() {
    const {
      classes,
      UI: {loading}
    } = this.props;
    const {errors} = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt='monkey' className={classes.image} />
          <Typography variant='h2' className={classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              fullWidth
              id='email'
              name='email'
              type='email'
              label='Email'
              helperText={errors.email}
              error={errors.email ? true : false}
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
            />
            <TextField
              fullWidth
              id='password'
              name='password'
              type='password'
              label='Password'
              helperText={errors.password}
              error={errors.password ? true : false}
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
            />
            <TextField
              fullWidth
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              label='ConfirmPassword'
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              className={classes.textField}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />
            <TextField
              fullWidth
              id='handle'
              name='handle'
              type='text'
              label='Handle'
              helperText={errors.handle}
              error={errors.handle ? true : false}
              className={classes.textField}
              value={this.state.handle}
              onChange={this.handleChange}
            />
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading ? (
                <CircularProgress size={20} className={classes.progress} />
              ) : null}
            </Button>
            <br />
            <small>
              Already have an account? Please log in
              <Link to='/login'> Here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired
};

const mapStatetoProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionstoProps = {
  signupUser
};

export default connect(
  mapStatetoProps,
  mapActionstoProps
)(withStyles(styles)(signup));
