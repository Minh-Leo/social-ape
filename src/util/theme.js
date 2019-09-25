export default {
  palette: {
    primary: {
      light: "#63B8B8",
      main: "#299E9E",
      dark: "#1E5454",
      contrastText: "#E6E6E6"
    },
    secondary: {
      light: "#FFA681",
      main: "#FF8552",
      dark: "#D16236",
      contrastText: "#ECECEC"
    }
  },
  spreadIt: {
    form: {
      textAlign: "center"
    },
    image: {
      margin: "20px auto 20px auto"
    },
    pageTitle: {
      margin: "10px auto 10px auto"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      marginTop: 20,
      marginBottom: 10,
      margin: "10%"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10
    },
    progress: {
      position: "absolute"
    },
    invisibleSeparator: {
      border: "none",
      margin: 4
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      marginBottom: 20
    },
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: "#00bcd4"
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    },
    card: {
      display: "flex",
      marginBottom: 20
    },
    cardContent: {
      width: "100%",
      flexDirection: "column",
      padding: 25
    },
    cover: {
      minWidth: 200,
      objectFit: "cover"
    },
    handle: {
      width: 60,
      height: 20,
      backgroundColor: "#299E9E",
      marginBottom: 7
    },
    date: {
      height: 14,
      width: 100,
      marginBottom: 5,
      backgroundColor: "rgba(0,0,0,0.2)"
    },
    fullLine: {
      height: 15,
      width: "90%",
      marginBottom: 10,
      backgroundColor: "rgba(0,0,0,0.4)"
    },
    halfLine: {
      height: 15,
      width: "50%",
      marginBottom: 10,
      backgroundColor: "rgba(0,0,0,0.4)"
    }
  }
};
