import React, {Component} from 'react';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Input,
  Icon,
  Tag,
  Card,
  Button,
  Avatar,
  List,
} from 'antd';
import styles from './Comments.less';
import {dateFtt} from '../../utils/utils'

const Search = Input.Search;
const {Meta} = Card;


export default class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      commentId: null,
    };
  }

  focusSearch() {
    console.log(this.refs)
    this.refs.search.focus()
  }

  editComment = (item) => {
    if (this.state.commentId === item.commentId) {
      this.setState({commentId: null, comment: ''})
    } else {
      this.setState({commentId: item.commentId, comment: item.content});
      this.focusSearch()
    }
  }

  onChangeComment = (e) => {
    this.setState({comment: e.target.value});
  }

  onReply = (e) => {
    this.setState({comment: 'Reply to @' + e + ': '});
    this.focusSearch();
  }

  componentDidMount() {
  }

  onTheShow() {
    this.props.dispatch({
      type: 'post/fetchComments',
      payload: this.props.postId,
    });
  }

  onComment = (value) => {
    if (this.state.commentId)
      return this.updateComment(value)
    this.props.dispatch({
      type: 'post/addComment',
      payload: {
        userId: localStorage.getItem('id'),
        postId: this.props.postId,
        content: value,
      },
    });
    setTimeout(() => this.onTheShow(), 500);
    this.setState({comment: ''});
  }

  updateComment = (value) => {
    console.log(value)
    this.props.dispatch({
      type: 'post/updateComment',
      payload: {
        commentId: this.state.commentId,
        params: {
          userId: localStorage.getItem('id'),
          postId: this.props.postId,
          content: value,
        }
      },
    });
    setTimeout(() => this.onTheShow(), 500);
    this.setState({comment: '', commentId: null});
  }

  deleteComment(value) {
    this.props.dispatch({
      type: 'post/deleteComment',
      payload: value
    });
    setTimeout(() => this.onTheShow(), 500);
    this.setState({comment: ''});
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'list/fetch',
    // });
  }

  render() {
    const {postId, list, loading} = this.props;
    const userId = localStorage.getItem('id');

    const IconText = ({type, text, onClick}) => (
      <span onClick={onClick}>
        <Icon type={type} style={{marginRight: 8}}/>
        {text}
      </span>
    );

    const ListContent = ({data: {content, id, userId}}) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{content}</div>
        <div className={styles.extra}>
          <Avatar size="small" style={{backgroundColor: '#2286ff'}}>{userId.charAt(0)}</Avatar>
          <Link to={`/posts/${userId}`}>{userId}</Link> commented
          at
          <em>{dateFtt('yyyy-MM-dd hh:mm', id.creationTime)}</em>
        </div>
      </div>
    );

    return (
      <div style={{backgroundColor: '#fafafa'}}>
        <List
          style={{paddingLeft: 60}}
          size="large"
          loading={list.length === 0 ? loading : false}
          rowKey="postId"
          itemLayout="vertical"
          locale={{emptyText: 'No Comments'}}
          dataSource={loading ? [] : list}
          renderItem={item => (
            <List.Item
              key={item.postId}
              actions={[
                <IconText type="like-o" text='like'/>,
                <IconText type="message" onClick={() => this.onReply(item.userId)} text='reply'/>,
              ].concat(item.userId === userId ? [
                <IconText type="edit" text='edit' onClick={() => this.editComment(item)}
                />,
                <IconText type="delete" text='delete' onClick={() => this.deleteComment(item.commentId)}
                />] : [],)}
              extra={<div className={styles.listItemExtra}/>}
            >
              <ListContent data={item}/>
            </List.Item>
          )}
        />
        <Search ref="search" placeholder="Share your idea..." onSearch={value => this.onComment(value)}
                value={this.state.comment}
                onChange={this.onChangeComment}
                enterButton={this.state.commentId ? "Edit" : "Comment"} size="default"/>

      </div>
    );
  }
}
