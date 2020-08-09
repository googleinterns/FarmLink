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
import SearchResults from 'react-filter-search';

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

class produce extends Component {
	constructor(props) {
		super(props);

		this.state = {
			produceObjects: [],
			name: '',
			produceId: '',
			shippingPresetTemperature: '',
			shippingMaintenanceTemperatureLow: '',
			shippingMaintenanceTemperatureHigh: '',
			price: '',
			pricePaid: '',
			amountMoved: '',
			errors: [],
			open: false,
			uiLoading: true,
			isFiltering: false,
			filterQuery: '',
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
			.get('/produce')
			.then((response) => {
				this.setState({
					produceObjects: response.data,
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
		let produceId = data.produce.produceId;
		axios
			.delete(`produce/${produceId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
		this.setState({
			name: data.produce.name,
			produceId: data.produce.produceId,
			shippingPresetTemperature: data.produce.shippingPresetTemperature,
			shippingMaintenanceTemperatureLow: data.produce.shippingMaintenanceTemperatureLow,
			shippingMaintenanceTemperatureHigh: data.produce.shippingMaintenanceTemperatureHigh,
			amountMoved: data.produce.amountMoved,
			price: data.produce.price,
			pricePaid: data.produce.pricePaid,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			name: data.produce.name,
			shippingPresetTemperature: data.produce.shippingPresetTemperature,
			shippingMaintenanceTemperatureLow: data.produce.shippingMaintenanceTemperatureLow,
			shippingMaintenanceTemperatureHigh: data.produce.shippingMaintenanceTemperatureHigh,
			amountMoved: data.produce.amountMoved,
			price: data.produce.price,
			pricePaid: data.produce.pricePaid,
			viewOpen: true
		});
	}

	handleSearch = event => {
		const { filterQuery } = event.target;
		this.setState({ filterQuery });
	  };
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
		const { produceObjects, filterQuery } = this.state;

		const handleClickOpen = () => {
			this.setState({
				name: '',
				produceId: '',
				shippingPresetTemperature: 0,
				shippingMaintenanceTemperatureLow: '',
				shippingMaintenanceTemperatureHigh: '',
				price: '',
				pricePaid: '',
				amountMoved: '',
				buttonType: '',
				open: true,
				render: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const newProduce = {
				name: this.state.name,
				shippingPresetTemperature: parseFloat(this.state.shippingPresetTemperature),
				shippingMaintenanceTemperatureLow: parseFloat(this.state.shippingMaintenanceTemperatureLow),
				shippingMaintenanceTemperatureHigh: parseFloat(this.state.shippingMaintenanceTemperatureHigh),
				price: parseFloat(this.state.price),
				pricePaid: parseFloat(this.state.pricePaid),
				amountMoved: parseFloat(this.state.amountMoved),
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/produce/${this.state.produceId}`,
					method: 'put',
					data: newProduce
				};
			} else {
				options = {
					url: '/produce',
					method: 'post',
					data: newProduce
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
					console.log(newProduce);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		const filterChanged = (event) => {
			this.setState({ isFiltering: true, filter: event.target.value });
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
						aria-label="Add Produce"
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
									{this.state.buttonType === 'Edit' ? 'Edit Produce' : 'Create a new Produce'}
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
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="produceName"
                                            label="Produce Name"
                                            name="name"
                                            autoComplete="produceName"
                                            helperText={errors.name}
                                            value={this.state.name}
                                            error={errors.name ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
									<Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="amountMoved"
                                            label="Amount Moved"
                                            name="amountMoved"
											autoComplete="amountMoved"
											defaultValue="0"
                                            helperText={errors.amountMoved}
                                            value={this.state.amountMoved}
                                            error={errors.amountMoved ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="price"
                                            label="USDA Price"
                                            name="price"
                                            type="number"
                                            autoComplete="price"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            helperText={errors.price}
                                            value={this.state.price}
                                            error={errors.price ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="pricePaid"
                                            label="Average Price Paid"
                                            name="pricePaid"
                                            type="number"
                                            autoComplete="pricePaid"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            helperText={errors.pricePaid}
                                            value={this.state.pricePaid}
                                            error={errors.pricePaid ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="shippingMaintenanceTemperatureLow"
                                            label="Shipping Maintenance Temperature Low"
                                            name="shippingMaintenanceTemperatureLow"
                                            type="number"
                                            autoComplete="shippingMaintenanceTemperatureLow"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">°F</InputAdornment>,
                                            }}
                                            helperText={errors.shippingMaintenanceTemperatureLow}
                                            value={this.state.shippingMaintenanceTemperatureLow}
                                            error={errors.shippingMaintenanceTemperatureLow ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="shippingMaintenanceTemperatureHigh"
                                            label="Shipping Maintenance Temperature High"
                                            name="shippingMaintenanceTemperatureHigh"
                                            type="number"
                                            autoComplete="shippingMaintenanceTemperatureHigh"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">°F</InputAdornment>,
                                            }}
                                            helperText={errors.shippingMaintenanceTemperatureHigh}
                                            value={this.state.shippingMaintenanceTemperatureHigh}
                                            error={errors.shippingMaintenanceTemperatureHigh ? true : false}
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="shippingPresetTemperature"
                                            label="Shipping Preset Temperature"
                                            name="shippingPresetTemperature"
                                            type="number"
                                            autoComplete="shippingPresetTemperature"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">°F</InputAdornment>,
                                            }}
                                            helperText={errors.shippingPresetTemperature}
                                            value={this.state.shippingPresetTemperature}
                                            error={errors.shippingPresetTemperature ? true : false}
                                            onChange={this.handleChange}
                                        />
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
										onChange={this.handleSearch} 
										filterQuery={filterQuery}
                                        />
                                    </div>
                                </Grid>
								<SearchResults
									filterQuery={filterQuery}
									produceObjects={produceObjects}
									renderResults={results => (
										<div>
                            				{results.map((produce) => (
												<Grid item xs={12}>
													<Card className={classes.root} variant="outlined">
														<CardContent>
															<Typography variant="h5" component="h2">
																{produce.name}
															</Typography>
															<Box display="flex" flexDirection="row" flexWrap="wrap" p={0} m={0}>
																<Box p={3}>
																	<Typography className={classes.pos} color="textSecondary">
																		Shipping Temperatures in Reefer (°F): 
																	</Typography>
																	<Typography variant="body2" component="p">
																		Maintenance Temperature: {produce.shippingMaintenanceTemperatureLow} - {produce.shippingMaintenanceTemperatureHigh}
																		<br />
																		Preset Temperature: {produce.shippingPresetTemperature}
																	</Typography>
																</Box>
																<Box p={3}>
																	<Typography className={classes.pos} color="textSecondary">
																		Pricing (in USD / lb):
																	</Typography>
																	<Typography variant="body2" component="p">
																		USDA Price: ${produce.price}
																		<br />
																		Average Price Paid by Farmlink: ${produce.pricePaid}
																	</Typography>
																</Box>
																<Box p={3}>
																	<Typography className={classes.pos} color="textSecondary">
																		Internal Statistics:
																	</Typography>
																	<Typography variant="body2" component="p">
																		Amount Moved by FarmLink (lbs): {produce.amountMoved}
																	</Typography>
																</Box>
															</Box> 
															
														</CardContent>
														<CardActions>
															<Button size="small" color="primary" onClick={() => this.handleViewOpen({ produce })}>
																{' '}
																View{' '}
															</Button>
															<Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ produce })}>
																Edit
															</Button>
															<Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ produce })}>
																Delete
															</Button>
														</CardActions>
													</Card>
												</Grid>
                            				))}
										</div>
									)}
								/>
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
							Stone Fruits
                            {this.state.name}
						</DialogTitle>
						<DialogContent dividers>
                            <Box display="flex" flexDirection="row" flexWrap="wrap" p={0} m={0}>
                                <Box p={3}>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Shipping Temperatures in Reefer (°F):
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Maintenance Temperature: {this.state.shippingMaintenanceTemperatureLow} - {this.state.shippingMaintenanceTemperatureLow}
                                        <br />
                                        Preset Temperature: {this.state.shippingPresetTemperature}
                                    </Typography>
                                </Box>
                                <Box p={3}>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Pricing (in USD / lb):
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        USDA Price: ${this.state.price}
                                        <br />
                                        Average Price Paid by Farmlink: ${this.state.pricePaid}
                                    </Typography>
                                </Box>
                                <Box p={3}>
                                    <Typography className={classes.pos} color="textSecondary">
                                        Internal Statistics:
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Amount Moved by FarmLink (lbs): {this.state.amountMoved}
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

export default (withStyles(styles)(produce));