import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 96,
    paddingBottom: 84,
    minHeight: '100vh',
    position: 'relative',
  },
  devStreamer: {
    width: '100%',
    backgroundColor: red[100],
  },
  devStreamerMedia: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  cannotUseModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  fab: {
    position: 'fixed!important',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  table: {
    minWidth: 650,
  },
}));

export default useStyle;
