import React, {Component} from 'react';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Icon,
  Tag,
  Card,
  Button,
  Divider,
  Avatar,
  List,
} from 'antd';
import PostForm from "../../components/Community/PostForm";
import Comments from "../../components/Community/Comments";
import styles from './AllPost.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {dateFtt} from '../../utils/utils'

const {Meta} = Card;


@connect((state) => ({
  list: state.post.list,
  loading: state.post.loading,
  comments: state.post.comments,
  commentLoading: state.post.commentLoading,
}))
export default class AllPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPost: false,
      current: null,
    }
    this.onCreate = this.onCreate.bind(this);
  }

  setNewPost() {
    this.setState({
      newPost: !this.state.newPost,
    })
  }

  queryComment(postId) {
    if (this.state.current === postId) {
      this.setState({
        current: null,
      })
    } else {
      this.setState({
        current: postId,
      })
    }
  }

  onDelete(postId) {
    console.log('delete', postId),
      this.props.dispatch({
        type: 'post/remove',
        payload: postId
      });
    setTimeout(() => this.onShow(), 500);
  }

  onCreate() {
    setTimeout(() => {
      this.onShow();
      this.setState({
        newPost: false,
      })
    }, 500);
  }

  componentDidMount() {
    this.onShow();
  }

  onShow() {
    this.setState({newPost: false})
    if (this.props.match.url === '/community') {
      this.props.dispatch({
        type: 'post/fetchList',
      });
    } else {
      this.props.dispatch({
        type: 'post/fetchUserList',
        payload: this.props.match.params.id ? this.props.match.params.id : localStorage.getItem('id'),
      });
      // this.props.dispatch({
      //   type: 'post/fetchUserComments',
      //   payload: this.props.match.params.id ? this.props.match.params.id : localStorage.getItem('id'),
      // });
    }

  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'list/fetch',
    // });
  }

  render() {
    const {list, loading, match, dispatch} = this.props;
    const userId = localStorage.getItem('id');

    const IconText = ({type, text, onClick}) => (
      <span onClick={onClick}>
        <Icon type={type} style={{marginRight: 8}}/>
        {text}
      </span>
    );

    const ListContent = ({data: {title, content, id, userId, postId, link}}) => (
      <div className={styles.listContent}>
        <div className={styles.listItemMetaTitle}>{title}</div>
        <div className={styles.description}>{content}</div>
        <div className={styles.extra}>
          <em>{dateFtt('yyyy-MM-dd hh:mm', id.creationTime)}</em>
          {link?<a href={link}>&nbsp;<Icon type="book"/></a>:null}
        </div>
      </div>
    );

    return (
      <PageHeaderLayout
        title={match.url === '/community' ? 'Community' :
          (match.params.id ? (match.params.id + "'s Posts") : 'My Posts')}
        content={''}
      >
        <div className={styles.container}>
          {this.props.match.url === '/community' ?
            <Card

              style={{marginTop: 0}}
              bordered={false}
              bodyStyle={{padding: '16px 16px 16px 16px', textAlign: 'center'}}
            >
              {!this.state.newPost ?
                <div style={{width: '100%', cursor: 'pointer'}} onClick={() => this.setNewPost()}><Icon
                  type="plus"/> New
                  Post</div>
                :
                <div>
                  <PostForm callback={() => this.onShow()}/>
                  <div style={{width: '100%', cursor: 'pointer'}} onClick={() => this.setNewPost()}>
                    <Icon type="up"/> Fold
                  </div>
                </div>
              }
            </Card> : null}

            <List
              grid={{gutter: 16, column: 2}}
              size="large"
              loading={list.length === 0 ? loading : false}
              rowKey="postId"
              itemLayout="vertical"
              dataSource={list}
              renderItem={item => (
                <List.Item
                  key={item.postId}
                >
                  <Card
                    style={{marginTop: 10}}
                    bordered={true}
                    actions={[
                      <IconText type="like-o" onClick={()=>{dispatch(routerRedux.push('/post/' + item.postId))}} text='like'/>,
                      <IconText type="message" onClick={()=>{dispatch(routerRedux.push('/post/' + item.postId))}} text='comment'/>].concat(
                      item.userId === userId ? [<IconText type="delete" text='delete'
                                                         onClick={() => this.onDelete(item.postId)}/>] : [])
                    }
                    bodyStyle={{padding: '0 20px 20px 20px'}}
                  >
                    <div style={{marginTop: 20}}>
                    <Card.Meta
                      avatar={<Avatar size="small" style={{backgroundColor: '#2286ff'}}>{item.userId.charAt(0)}</Avatar>}
                      title={<Link to={`/posts/${item.userId}`}>
                       {item.userId}
                        </Link>}
                    />
                    </div>
                  <div>
                    <ListContent data={item}/>
                  </div>
                  {/*{item.postId === this.state.current ?*/}
                    {/*<div>*/}
                      {/*<Comments postId={item.postId} loading={this.props.commentLoading}*/}
                                {/*dispatch={this.props.dispatch} list={this.props.comments}/></div> : null}*/}
                  </Card>
                </List.Item>

              )}
            />
        </div>
      </PageHeaderLayout>
    );
  }
}
