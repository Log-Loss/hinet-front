import React, {Component} from 'react';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import {Row, Col, Card, Avatar, List, Icon, Input, Button, Tooltip} from 'antd';
import styles from './PostDetail.less';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {dateFtt} from "../../utils/utils";
import Comments from "../../components/Community/Comments";

const {Meta} = Card;
const {TextArea} = Input;


@connect((state) => ({
  loading: state.post.loading,
  readList: state.post.readList
}))
export default class PostDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'post/fetchReadList',
      payload: localStorage.getItem('id')
    });
  }

  render() {
    const {readList, loading, dispatch} = this.props;
    const userId = localStorage.getItem('id');
    if (!readList) return null;


    return (
      <PageHeaderLayout
        title={'My Read List'}
        content={''}
      >
        <div className={styles.container}>
          <Row>
            <Col span={12}>
              <Card>
                <a href={readList.links}>{readList.links}</a>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}
