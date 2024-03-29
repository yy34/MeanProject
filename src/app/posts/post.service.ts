import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; allPostCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalCount: number }>(
        apiUrl + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                creator: post.creator,
              };
            }),
            totalCount: postData.totalCount,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          allPostCount: transformedPostData.totalCount,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      creator: string;
    }>(apiUrl + id);
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content,
      creator: undefined,
    };
    this.http
      .post<{ message: string; postId: string }>(apiUrl, post)
      .subscribe((responseData) => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      creator: undefined,
    };
    this.http.put(apiUrl + id, post).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(apiUrl + postId);
  }
}
