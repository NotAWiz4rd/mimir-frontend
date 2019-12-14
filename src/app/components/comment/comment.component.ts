import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../classes/Comment';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  comment: Comment;

  constructor(public userService: UserService) {
  }

  ngOnInit() {
  }

}
