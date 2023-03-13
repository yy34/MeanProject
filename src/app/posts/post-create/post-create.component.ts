import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { pageMode } from './post-create.constants';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  post!: Post;
  mode = pageMode.create;
  postId: any;
  loading: boolean = false;
  postForm!: FormGroup;
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((mapParams: ParamMap) => {
      if (mapParams.has('p_id')) {
        this.mode = pageMode.edit;
        this.postId = mapParams.get('p_id');
        this.loading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.loading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          console.log('post2', this.post);
          this.postForm.setValue({
            title: this.post.title,
            content: this.post.content,
          });

          console.log('post3', this.post);
        });
      } else {
        this.mode = pageMode.create;
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.postForm.invalid) {
      return;
    }
    if (this.mode === pageMode.create) {
      this.postsService.addPost(
        this.postForm.value.title,
        this.postForm.value.content
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content
      );
    }
    this.postForm.reset();
  }
}
