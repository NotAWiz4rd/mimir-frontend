import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../classes/Comment';
import {UserService} from '../../services/user.service';
import {FileService} from '../../services/file.service';
import {FormControl} from '@angular/forms';
import {StaticTextService} from '../../services/static-text.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  fileId: number;

  control = new FormControl();

  comments: Comment[] = [];
  newComment: string = '';

  constructor(public userService: UserService,
              public staticTextService: StaticTextService,
              public languageService: LanguageService,
              private fileService: FileService) {
  }

  ngOnInit() {
    this.loadComments();
    this.control.valueChanges.subscribe(result => this.newComment = result);
  }

  async deleteComment(commentId: number) {
    await this.fileService.deleteComment(commentId);
    this.loadComments();
  }

  postComment() {
    this.fileService.addComment(this.fileId, this.newComment).subscribe(comment => {
      this.newComment = '';
      this.comments.push(comment);
    });
  }

  loadComments() {
    if (this.fileId != undefined) {
      this.fileService.getComments(this.fileId).subscribe(comments => {
        this.comments = comments;
      });
    }
  }
}
