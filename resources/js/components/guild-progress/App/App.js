import React, {PureComponent} from 'react'
import DateRangeFilter from '../DateRangeFilter'
import {Divider, Loader, Segment, Dimmer, Button, Container} from 'semantic-ui-react'
import MainTable from '../MainTable'
import moment from 'moment'
import axios from 'axios'

export default class App extends PureComponent {

    state = {
        loading: true,
        error: false,
        isSearchDisabled: false,
        startDate: moment().add(-2, 'd'),
        endDate: moment().add(-1, 'd'),
        data: []
    }

    handleDateClose = ({startDate, endDate}) => {
        let isSearchDisabled = false;
        if (startDate === null || endDate === null) isSearchDisabled = true;
        this.setState({startDate, endDate, isSearchDisabled});
    }

    loadData = () => {
        const {startDate, endDate} = this.state
        this.setState(state => {
            return {loading: true, data: []}
        }, () => axios
            .get(`get-progress/${startDate.format('DD.MM.YYYY')}/${endDate.format('DD.MM.YYYY')}`)
            .then(data => {
                this.setState(state => {
                    return {
                        data: data.data,
                        loading: false
                    }
                })
            })
            .catch(error => {
                this.setState({error: true})
            }))
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        const {data, loading, isSearchDisabled, startDate, endDate, error} = this.state
        let dataComponent = data.length > 0 ? <MainTable rawData={data}/> : <EmptyData/>
        dataComponent =  error === true ? <Error/> : dataComponent
        return (
            <React.Fragment>
                <Segment vertical>
                    <DateRangeFilter startDate={startDate} endDate={endDate} onClose={this.handleDateClose}/>
                </Segment>
                <Segment vertical>
                    <Button color="blue" basic size="big" disabled={isSearchDisabled}
                            onClick={this.loadData}>Поиск</Button>
                </Segment>
                {loading === true ? <Loading/> : dataComponent}
            </React.Fragment>
        )
    }
}

const Loading = () => {
    return (
        <Segment style={{height: "100px"}}>
            <Dimmer active inverted>
                <Loader size='medium'>Идет загрузка данных</Loader>
            </Dimmer>
        </Segment>
    )
}
const Error = () => {
    return (
        <Segment style={{height: "100px"}}>
            <Container textAlign='center'>
                <p>Произошла ошибка</p>
            </Container>
        </Segment>
    )
}
const EmptyData = () => {
    return (
        <Segment style={{height: "100px"}}>
            <Container textAlign='center'>
                <p>Данные отсутсвуют</p>
            </Container>
        </Segment>
    )
}