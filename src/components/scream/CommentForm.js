import React, {Component} from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import {connect} from "react-redux";
import {submitComment} from "../../redux/actions/dataActions";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  ...theme.spreadIt
});

class CommentForm extends Component {
  state = {
    body: "",
    errors: {}
  };

  static getDerivedStateFromProps = nextProps => {
    if (nextProps.UI.errors) {
      return {errors: nextProps.UI.errors};
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      return {errors: {}};
    } else return null;
  };

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.submitComment(this.props.screamId, {body: this.state.body});
    this.setState({body: ""});
  };

  render() {
    const {classes, authenticated} = this.props;
    const errors = this.state.errors;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{textAlign: "center"}}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name='body'
            type='text'
            label='Comment on Scream'
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}
          >
            Submit
          </Button>
        </form>
        {/* <hr className={classes.visibleSeparator} /> */}
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});
const mapActionsToProps = {
  submitComment
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(CommentForm));
