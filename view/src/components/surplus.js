import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import InputBase from '@material-ui/core/InputBase';
// import { fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        // backgroundColor: fade(theme.palette.primary.main, 0.15),
        // '&:hover': {
        // backgroundColor: fade(theme.palette.primary.main, 0.25),
        // },
        // //backgroundColor: theme.palette.primary.main,
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        //transition: theme.transitions.create('width'),
        width: '100%',
        // [theme.breakpoints.up('sm')]: {
        // width: '100ch',
        // '&:focus': {
        //     width: '100ch',
        // },
        // },
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class todo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			todos: '',
			title: '',
			body: '',
			todoId: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false
		};

		this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/todos')
			.then((response) => {
				this.setState({
					todos: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	deleteTodoHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let todoId = data.todo.todoId;
		axios
			.delete(`todo/${todoId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
		this.setState({
			title: data.todo.title,
			body: data.todo.body,
			todoId: data.todo.todoId,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			title: data.todo.title,
			body: data.todo.body,
			viewOpen: true
		});
	}

	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
				todoId: '',
				title: '',
				body: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userTodo = {
				title: this.state.title,
				body: this.state.body
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/todo/${this.state.todoId}`,
					method: 'put',
					data: userTodo
				};
			} else {
				options = {
					url: '/todo',
					method: 'post',
					data: userTodo
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Todo"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
							</Toolbar>
						</AppBar>
                        <Container maxWidth="lg">
                            <form className={classes.form} noValidate>
                                <Grid container spacing={4}
                                      allignItems="center"
                                >
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            id="originFarm"
                                            options={farmsExamples}
                                            getOptionLabel={(option) => option.title}
                                            fullWidth
                                            renderInput={(params) => <TextField {...params} label="Origin Farm" variant="outlined" />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            id="produceName"
                                            options={produceExamples}
                                            getOptionLabel={(option) => option.title}
                                            fullWidth
                                            renderInput={(params) => <TextField {...params} label="Produce Types" variant="outlined" />}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="available-label">Status</InputLabel>
                                            <Select
                                            labelId="available-outlined-label"
                                            id="available"
                                            // value={age}
                                            onChange={this.handleChange}
                                            label="Status"
                                            >
                                            <MenuItem value={true}>Available</MenuItem>
                                            <MenuItem value={false}>Not Available</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="cost"
                                            label="Cost (per lb)"
                                            name="cost"
                                            type="number"
                                            autoComplete="cost"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            // helperText={errors.title}
                                            // value={this.state.title}
                                            // error={errors.title ? true : false}
                                            // onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="totalQuantityAvailable"
                                            label="Total Quantity Available"
                                            name="totalQuantityAvailable"
                                            type="number"
                                            autoComplete="totalQuantityAvailable"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                                            }}
                                            // helperText={errors.title}
                                            // value={this.state.title}
                                            // error={errors.title ? true : false}
                                            // onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="packagingType-label">Packaging Type</InputLabel>
                                            <Select
                                            labelId="packagingType-outlined-label"
                                            id="packagingType"
                                            // value={age}
                                            onChange={this.handleChange}
                                            label="Packaging Type"
                                            >
                                            <MenuItem value="Open Crates">Open Crates</MenuItem>
                                            <MenuItem value="Closed Crates">Closed Crates</MenuItem>
                                            <MenuItem value="Sacks">Sacks</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </Container>
					</Dialog>
                    <Container maxWidth="lg">
                        <Grid container spacing={2}
                              alignItem="center">
                                <Grid item xs={12}>
                                    <div className={classes.search}>
                                        <div className={classes.searchIcon}>
                                        <SearchIcon />
                                        </div>
                                        <InputBase
                                        fullWidth={true}
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </div>
                                </Grid>
                            {this.state.todos.map((todo) => (
                                <Grid item xs={12}>
                                    <Card className={classes.root} variant="outlined">
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                50k lbs of Apples from Taylor Farms
                                                {/* {todo.title} */}
                                            </Typography>
                                            <Box display="flex" flexDirection="row" flexWrap="wrap" p={0} m={0}>
                                                <Box p={3}>
                                                    <Typography className={classes.pos} color="textSecondary">
                                                        Logistics:
                                                    </Typography>
                                                    <Typography variant="body2" component="p">
                                                        Origin: Taylor Farms (link with card + info)
                                                        <br />
                                                        Packing Type: Crates
                                                        <br />
                                                        Available: yes
                                                    </Typography>
                                                </Box>
                                                <Box p={3}>
                                                    <Typography className={classes.pos} color="textSecondary">
                                                        Details:
                                                    </Typography>
                                                    <Typography variant="body2" component="p">
                                                        Type of Produce: Apples
                                                        <br />
                                                        Total Quantity Available (lbs): 50,000
                                                        <br />
                                                        Cost (USD / lb): $0.62
                                                    </Typography>
                                                </Box>
                                            </Box> 
                                            
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary" onClick={() => this.handleViewOpen({ todo })}>
                                                {' '}
                                                View{' '}
                                            </Button>
                                            <Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo })}>
                                                Edit
                                            </Button>
                                            <Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>

					<Dialog
						onClose={handleViewClose}
						aria-labelledby="customized-dialog-title"
						open={viewOpen}
						fullWidth
						classes={{ paperFullWidth: classes.dialogeStyle }}
					>
						<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
							50k lbs of Apples from Taylor Farms
                            {/* {this.state.title} */}
						</DialogTitle>
						<DialogContent dividers>
							{/* <TextField
								fullWidth
								id="todoDetails"
								name="body"
								multiline
								readonly
								rows={1}
								rowsMax={25}
								value={this.state.body}
								InputProps={{
									disableUnderline: true
								}}
							/> */}
                             <Box display="flex" flexDirection="row" flexWrap="wrap" p={0} m={0}>
                                <Box p={3}>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Logistics:
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Origin: Taylor Farms (link with card + info)
                                        <br />
                                        Packing Type: Crates
                                        <br />
                                        Available: yes
                                    </Typography>
                                </Box>
                                <Box p={3}>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Details:
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Type of Produce: Apples
                                        <br />
                                        Total Quantity Available (lbs): 50,000
                                        <br />
                                        Cost (USD / lb): $0.62
                                    </Typography>
                                </Box>
                            </Box> 
						</DialogContent>
					</Dialog>
				</main>
			);
		}
	}
}

const farmsExamples = [
    { title: 'Borden Farms', id: 0 },
    { title: 'San Cristobal Apple Orchars', id:1 },
    { title: 'Taylor Farms', id:2 }
];

const produceExamples = [
    { title: 'Stone Fruits' },
    { title: 'Potatoes' },
    { title: 'Dairy/Eggs' }
];

export default (withStyles(styles)(todo));