import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 96,
    maxHeight: "100vh",
  },
  devStreamer: {
    // width: "100%",
    // height: 800,
    backgroundColor: red[100],
    // marginBottom: 30,
    // objectFit: "contain",
  },
  cannotUseModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cannotUseModalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export default useStyle;
