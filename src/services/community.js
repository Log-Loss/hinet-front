import { stringify } from 'qs';
import request from '../utils/request';

import {communityUrl} from './config';

export async function getAllPosts() {
  return request(`${communityUrl}/post`);
}

export async function getPost(postId) {
  return request(`${communityUrl}/post/${postId}`);
}

export async function addPost(params) {
  return request(`${communityUrl}/post`, {
    method: 'POST',
    body: params,
  });
}

export async function updatePost({postId, params}) {
  return request(`${communityUrl}/post/${postId}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deletePost(postId) {
  return request(`${communityUrl}/post/${postId}`, {
    method: 'DELETE',
  });
}

export async function getComments(postId) {
  return request(`${communityUrl}/comment/post/${postId}`);
}

export async function getLikes(postId) {
  return request(`${communityUrl}/like/post/${postId}`);
}

export async function addComment(params) {
  return request(`${communityUrl}/comment`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteComment(postId) {
  return request(`${communityUrl}/comment/${postId}`, {
    method: 'DELETE',
  });
}

export async function updateComment({commentId, params}) {
  return request(`${communityUrl}/comment/${commentId}`, {
    method: 'PUT',
    body: params
  });
}

export async function addLike({postId, userId}) {
  return request(`${communityUrl}/like`, {
    method: 'POST',
    body: {postId, userId}
  });
}

export async function deleteLike(likeId) {
  return request(`${communityUrl}/like/${likeId}`, {
    method: 'DELETE',
  });
}

export async function getPostsByUser(userId) {
  return request(`${communityUrl}/post/user/${userId}`);
}

export async function getCommentsByUser(userId) {
  return request(`${communityUrl}/post/user/${userId}`);
}

export async function addReadList(params) {
  return request(`${communityUrl}/readlist`, {
    method: 'POST',
    body: params
  });
}

export async function getReadList(userId) {
  return request(`${communityUrl}/readlist/user/${userId}`)
}



