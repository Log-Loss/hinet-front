import React from 'react';
import {connect} from 'dva';
import {Button, Row, Col, Tooltip, Icon, Menu, Dropdown, Avatar} from 'antd';
import {routerRedux} from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';
import TrainingForm from '../../../components/Hinet/TrainingForm';
import {WaterWave, Pie, ChartCard, Field} from '../../../components/Charts';
import FooterToolbar from '../../../components/FooterToolbar';
import {dateFtt} from '../../../utils/utils';
import StatChart from "../../../components/Hinet/StatChart";


class Step3 extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const colors = ['#ff4d4f', '#fadb14', '#389e0d', '#5b8dff'];
    const {dispatch, jobs, job, state, total, percent} = this.props;
    const onPrev = () => {
      dispatch(routerRedux.push(`/model/${this.props.match.params.id}/build`));
    };
    const menuClick = ({key}) => {
      this.props.dispatch({
        type: 'job/fetchJob',
        payload: jobs[key].id,
      })
    };
    const information = (
      <div className={styles.information}>
        goodbye
      </div>
    );
    const menu = (
      <Menu onClick={menuClick}>
        {jobs.map((e, index) => (
          <Menu.Item key={index}>
            <a style={{color: job.id === e.id ? '#5b8dff' : undefined}}>
              {`${dateFtt("yyyy-MM-dd hh:mm:ss", e.createTime)}`}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    );


    if (!job || !job.id) {
      return (
        <div>
          <div style={{width: '100%', border: '1px solid #eeeeee', padding: 20, marginBottom: 10}}>
            <TrainingForm/>
          </div>
          <FooterToolbar children={
            <Button type="dashed" onClick={onPrev} key={0}>
              Prev Step
            </Button>
          }/>
        </div>
      )
    }
    const footer = (
      <div>
        <Tooltip placement='left' title={job.message || 'SUCCESS'}>
          <Field label="Message" value={job.message ? 'ERROR' : 'SUCCESS'}/>
        </Tooltip>
      </div>
    );
    return (
      <div>
        <div>todo</div>

        <FooterToolbar children={
          <Button type="dashed" onClick={onPrev} key={0}>
            Prev Step
          </Button>
        }/>

      </div>
    );
  }
}

export default connect(({model, job}) => {
  if (!job.job || !job.job.id) {
    return {
      jobs: job.jobs,
      job: job.job,
      state: [],
      total: 0,
      percent: 0,
    }
  }
  const state = job.job ? JSON.parse(job.job.state || '[]') : [];
  const total = (job.epochs && job.batchSize && model.model.datasetId) ?
    Math.round(model.datasets.find(e => e.id === model.model.datasetId).amount * job.epochs / job.batchSize) : 0;
  const percent = total ? (state.length / total * 100) : 0;
  return {
    jobs: job.jobs,
    job: job.job,
    state: state.length && job.job.finishTime?state:[...state, {iteration: total, score: null}],
    total,
    percent: percent > 100 ? 100 : percent,
  }
})(Step3);
