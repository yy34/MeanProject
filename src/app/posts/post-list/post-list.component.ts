import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSub: Subscription = new Subscription();
  posts: Post[] = [];
  loading: boolean = false;
  totalPosts: number = 0;
  currentPage: number = 1;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 25];

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.loading = true;
    this.getAllPost();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((data: { posts: Post[]; allPostCount: number }) => {
        this.loading = false;
        this.totalPosts = data.allPostCount;
        this.posts = data.posts;
      });
  }
  getAllPost() {
    this.postsService.getPosts(this.tableSize, this.currentPage);
  }

  deletePost(postId: string) {
    this.loading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.getAllPost();
    });
  }
  onPageChanged(pageInfo: PageEvent) {
    this.loading = true;
    this.currentPage = pageInfo.pageIndex + 1;
    this.tableSize = pageInfo.pageSize;
    this.getAllPost();
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
