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
  item: state.post.item,
  loading: state.post.loading,
  comments: state.post.comments,
  commentLoading: state.post.commentLoading,
  likes: state.post.likes,
  likeLoading: state.post.likeLoading,
}))
export default class PostDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      content: '',
      link: '',
      title: ''
    }
  }

  queryComment() {
    this.refs.comments.focusSearch()
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'post/fetch',
      payload: this.props.match.params.postId
    });
    this.props.dispatch({
      type: 'post/fetchComments',
      payload: this.props.match.params.postId,
    });
    this.props.dispatch({
      type: 'post/fetchLikes',
      payload: this.props.match.params.postId,
    });
  }

  onEditStart = (item) => {
    this.setState({editing: true, content: item.content, title: item.title, link: item.link})
  }

  onEditCancel = () => {
    this.setState({editing: false})
  }

  onReadList = () => {
    this.props.dispatch({
      type: 'post/addReadList',
      payload: {
        userId: localStorage.getItem('id'),
        links: [this.props.item.link]
      }
    });
  }



  onEdit = () => {
    this.props.dispatch({
      type: 'post/put',
      payload: {
        postId: this.props.item.postId,
        params: {
          userId: this.props.item.userId,
          link: this.state.link,
          title: this.state.title,
          content: this.state.content
        }
      }
    });
    this.setState({editing: false})
    this.componentDidMount()
  }

  onLike = () => {
    const userId = localStorage.getItem('id');
    const likes = this.props.likes
    const like = likes.find(e => e.userId === userId)
    if (!like) {
      this.props.dispatch({
        type: 'post/addLike',
        payload: {
          postId: this.props.item.postId,
          userId
        }
      });

    } else {
      this.props.dispatch({
        type: 'post/deleteLike',
        payload: like.likeId
      });

    }
    setTimeout(() => this.props.dispatch({
      type: 'post/fetchLikes',
      payload: this.props.match.params.postId,
    }), 500)
  }



  render() {
    const {item, loading, dispatch, comments, likes} = this.props;
    const userId = localStorage.getItem('id');
    if (!item || !item.id) return null;


    const ListContent = ({data: {title, content, id, userId, postId, link}}) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{content}</div>
        <div className={styles.extra}>
          <em>{dateFtt('yyyy-MM-dd hh:mm', id.creationTime)}</em>
          {link?<a href={link}>&nbsp;<Icon type="book"/>&nbsp;</a>:null}
          {link?<a onClick={this.onReadList}>Add to read list</a>:null}
        </div>
      </div>
    );
    const IconText = ({type, text, onClick}) => (
      <span onClick={onClick}>
        <Icon type={type} style={{marginRight: 8}}/>
        {text}
      </span>
    );
    return (
      <PageHeaderLayout
        title={this.state.editing ?
          <Input value={this.state.title || ''} onChange={(e) => this.setState({title: e.target.value})}/>
          : item.title}
        content={''}
        action={item.userId === userId ? (this.state.editing?<Button.Group>
          <Button onClick={() => this.onEdit()}>Save</Button>
          <Button onClick={() => this.onEditCancel()}>Cancel</Button>
        </Button.Group>:<Button.Group>
          <Button onClick={() => this.onEditStart(item)}>Edit</Button>
        </Button.Group>) : null}
      >
        <div className={styles.container}>
          <Card
            loading={loading}
            style={{marginTop: 10}}
            bordered={true}
            actions={[
              <IconText type={likes.find(e => e.userId === userId)?"like":"like-o"} onClick={() => {
                this.onLike()
              }} text={<Tooltip title={likes && likes.map(e => e.userId).join(', ')} >
                like ({likes && likes.length})</Tooltip>}/>,

              <IconText type="message" onClick={() => this.queryComment(item.postId)}
                        text={
                          <span>comment ({comments && comments.length})</span>} />]
            }
            bodyStyle={{padding: '0 20px 20px 20px'}}
          >
            <div style={{marginTop: 20}}>
              <Card.Meta
                avatar={<Avatar size="small" style={{backgroundColor: '#2286ff'}}>{item.userId.charAt(0)}</Avatar>}
                title={<Link to={`/posts/${item.userId}`}>{item.userId}</Link>}
              />
            </div>
            <div>
              {!this.state.editing ?
                <ListContent data={item}/> :
                <div>
                  <TextArea value={this.state.content || ''} onChange={(e)=>this.setState({content: e.target.value})}/>
                  <Input style={{marginTop: 5}} placeholder="link"
                         value={this.state.link || ''} onChange={(e) => this.setState({link: e.target.value})}/>
                </div>}
            </div>
          </Card>
          <Card style={{marginTop: 20, marginBottom: 10}} bodyStyle={{padding: 0}} title={'Comments'}>
            <Comments ref="comments" postId={item.postId} loading={this.props.commentLoading}
                      dispatch={dispatch} list={this.props.comments}/>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
