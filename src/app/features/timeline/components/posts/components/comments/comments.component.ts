import { Comment } from './../../models/comment.interface';
import { CommentsService } from './../../services/comments.service';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  user = signal(JSON.parse(localStorage.getItem('user')!));
  commentContent = new FormControl('', Validators.required);
  imgSrc = signal('');
  file = signal<File | null>(null);

  editingImgSrc = signal('');
  editingFile = signal<File | null>(null);
  editingContent = new FormControl('', Validators.required);
  removeCurrentImage = signal(false);

  replyContent = new FormControl('', Validators.required);
  replyImg = signal<File | null>(null);
  replySrc = signal('');

  postId = input.required<string>();

  allComments = signal<Comment[]>([]);
  allReplies = signal<Comment[]>([]);
  commentsLimit = signal(5);
  replysLimit = signal(5);

  loading = signal(false);
  hasMoreComments = signal(true);
  page = 2;

  CommentCount = input.required<number>();

  editingReplyFile = signal<File | null>(null);
  editingReplySrc = signal('');
  editingReplyContent = new FormControl('', Validators.required);
  removeCurrentReplyImg = signal(false);

  finalCommentsCounts = computed(() => {
    const length = this.allComments().length;
    const inputNumber = this.CommentCount() ?? 0;

    return inputNumber - length;
  });

  localCommentCount = signal(0);
  commentCountChange = output<number>();

  ngOnInit(): void {
    this.localCommentCount.set(this.CommentCount());
    this.getComments();
  }

  getComments(): void {
    this.commentsService.getAllComments(this.postId(), 1, this.commentsLimit()).subscribe({
      next: (res) => {
        const freshComments = res.data.comments;

        this.allComments.update((currentComments) => {
          return freshComments.map((newComment: any) => {
            // ابحث إذا كان التعليق موجوداً مسبقاً في الواجهة
            const oldComment = currentComments.find((c) => c._id === newComment._id);
            if (oldComment) {
              // دمج البيانات الجديدة من السيرفر مع الحالة المفتوحة والردود المحملة مسبقاً
              return {
                ...newComment,
                showReplies: oldComment.showReplies,
                replies: oldComment.replies,
              };
            }
            return newComment;
          });
        });

        setTimeout(() => initFlowbite(), 0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeFile(e: Event, isEditing: boolean = false, isReply: boolean = false): void {
    let input = e.target as HTMLInputElement;

    if (isReply) {
      if (input.files && !isEditing) {
        this.replyImg.set(input.files[0]);
        this.replySrc.set(URL.createObjectURL(input.files[0]));
      } else if (input.files && isEditing) {
        this.editingReplyFile.set(input.files[0]);
        this.editingReplySrc.set(URL.createObjectURL(input.files[0]));
      }
    } else if (!isReply) {
      if (input.files && !isEditing) {
        this.file.set(input.files[0]);
        this.imgSrc.set(URL.createObjectURL(input.files[0]));
      } else if (input.files && isEditing) {
        this.editingFile.set(input.files[0]);
        this.editingImgSrc.set(URL.createObjectURL(input.files[0]));
      }
    }
  }

  removePreview(): void {
    this.imgSrc.set('');
    this.file.set(null);
    this.replyImg.set(null);
    this.replySrc.set('');
  }

  removeAllImage(): void {
    this.editingImgSrc.set('');
    this.editingFile.set(null);
    this.removeCurrentImage.set(true);
  }

  submitForm(e: SubmitEvent): void {
    e.preventDefault();

    let formData = new FormData();

    if (this.commentContent.value) {
      formData.append('content', this.commentContent.value);
    }
    if (this.file()) {
      formData.append('image', this.file()!);
    }
    this.commentsService.createComment(this.postId(), formData).subscribe({
      next: (res) => {
        this.removePreview();
        this.commentContent.setValue('');
        this.localCommentCount.update((val) => val + 1);
        this.commentCountChange.emit(1);
        this.getComments();
      },
    });
  }

  deleteComment(postId: string, commentId: string): void {
    this.commentsService.deleteComment(postId, commentId).subscribe({
      next: (res) => {
        this.localCommentCount.update((val) => Math.max(0, val - 1));
        this.commentCountChange.emit(-1);
        this.getComments();
      },
    });
  }

  likeComment(postId: string, commentId: string) {
    this.commentsService.likeComment(postId, commentId).subscribe({
      next: (res) => {
        this.getComments();
      },
    });
  }

  updateComment(e: SubmitEvent, postId: string, commentId: string) {
    e.preventDefault();
    const formData = new FormData();

    if (this.editingContent.value) {
      formData.append('content', this.editingContent.value);
    }

    if (this.editingFile() && !this.removeCurrentImage()) {
      formData.append('image', this.editingFile()!);
    }

    if (this.removeCurrentImage()) {
      formData.append('removeImage', 'true');
    }

    this.commentsService.updateComment(postId, commentId, formData).subscribe({
      next: (res) => {
        this.editingContent.setValue('');
        this.editingFile.set(null);
        this.editingImgSrc.set('');
        this.removeCurrentImage.set(false);

        this.getComments(); // إعادة جلب التعليقات لتحديث الواجهة
      },
    });
  }

  updateReply(e: SubmitEvent, postId: string, commentId: string, replyId: string) {
    e.preventDefault();
    const formData = new FormData();

    if (this.editingReplyContent.value) {
      formData.append('content', this.editingReplyContent.value);
    }

    if (this.editingReplyFile() && !this.removeCurrentReplyImg()) {
      formData.append('image', this.editingReplyFile()!);
    }

    if (this.removeCurrentReplyImg()) {
      formData.append('removeImage', 'true');
    }

    this.commentsService.updateReply(postId, replyId, formData).subscribe({
      next: (res) => {
        this.editingReplyContent.setValue('');
        this.editingReplyFile.set(null);
        this.editingReplySrc.set('');
        this.removeCurrentReplyImg.set(false);
        this.getReplys(postId, commentId);
      },
    });
  }

  getReplys(postId: string, commentId: string): void {
    this.commentsService.getCommentReplies(postId, commentId).subscribe({
      next: (res) => {
        // تحديث الـ replies داخل التعليق المحدد حصرياً في الـ allComments signal
        this.allComments.update((comments) =>
          comments.map((comment) =>
            comment._id === commentId ? { ...comment, replies: res.data.replies } : comment,
          ),
        );
        setTimeout(() => initFlowbite(), 0);
      },
    });
  }
  CommentLike(comment: Comment, postID: string, commentId: string) {
    this.commentsService.likeComment(postID, commentId).subscribe({
      next: (res) => {
        this.getComments();
        if (comment.replies) {
          this.getReplys(postID, commentId);
        }
      },
    });
  }

  toggleReplies(comment: Comment): void {
    const willShow = !comment.showReplies;

    this.allComments.update((comments) =>
      comments.map((c) => (c._id === comment._id ? { ...c, showReplies: willShow } : c)),
    );

    if (willShow && !comment.replies) {
      this.commentsService.getCommentReplies(this.postId(), comment._id).subscribe({
        next: (res) => {
          this.allComments.update((comments) =>
            comments.map((c) => (c._id === comment._id ? { ...c, replies: res.data.replies } : c)),
          );
          // هذا السطر مهم جداً لتفعيل Flowbite لل عناصر الجديدة في الـ DOM
          setTimeout(() => initFlowbite(), 0);
        },
      });
    } else {
      // حتى لو كانت الردود موجودة مسبقاً، قم بتفعيل الـ Flowbite فور فتح القائمة
      setTimeout(() => initFlowbite(), 0);
    }
  }

  loadMoreComments(): void {
    if (this.loading() || !this.hasMoreComments()) {
      return;
    }
    this.loading.set(true);

    this.commentsService.getAllComments(this.postId(), this.page, 5).subscribe((res) => {
      const comments = res.data.comments;

      this.allComments.update((currentComments) => {
        const existingId = new Set(currentComments.map((c) => c._id));
        const uniqueNewComm = comments.filter((c: any) => !existingId.has(c._id));

        return [...currentComments, ...uniqueNewComm];
      });
      this.page++;
      this.hasMoreComments.set(this.CommentCount() > this.allComments().length);
      this.loading.set(false);
      setTimeout(() => initFlowbite(), 0);
    });
  }

  createReply(e: SubmitEvent, commentId: string): void {
    e.preventDefault();

    let formData = new FormData();

    if (this.replyContent.value) {
      formData.append('content', this.replyContent.value);
    }
    if (this.replyImg()) {
      formData.append('image', this.replyImg()!);
    }
    this.commentsService.createCommentReply(this.postId(), commentId, formData).subscribe({
      next: (res) => {
        this.allComments.update((comments) =>
          comments.map((c) =>
            c._id === commentId ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } : c,
          ),
        );
        this.getReplys(this.postId(), commentId);
        this.removePreview();
        this.replyContent.setValue('');
      },
    });
  }

  likeReply(postId: string, commentId: string, replyId: string): void {
    this.commentsService.likeComment(this.postId(), replyId).subscribe({
      next: (res) => {
        this.getReplys(postId, commentId);
      },
    });
  }

  openEditComment(comment: Comment): void {
    // 1. تعبئة النص القديم في الـ FormControl للتعليق
    this.editingContent.setValue(comment.content);

    // 2. تصفير ملفات التعديل القديمة
    this.editingFile.set(null);
    this.editingImgSrc.set('');
    this.removeCurrentImage.set(false);
    setTimeout(() => initFlowbite(), 0);

    // 3. تحديث الـ Signal لتفعيل وضع التعديل لهذا التعليق فقط
    this.allComments.update((comments) =>
      comments.map((c) => ({
        ...c,
        isEditing: c._id === comment._id, // تفعيل التعديل للعنصر المستهدف وإغلاقه للبقية
      })),
    );
  }

  closeEditComment(comment: Comment): void {
    this.allComments.update((comments) =>
      comments.map((c) => (c._id === comment._id ? { ...c, isEditing: false } : c)),
    );
    this.editingContent.setValue('');
    this.removeCurrentImage.set(false);
    setTimeout(() => initFlowbite(), 0);
  }

  openEditReply(reply: Comment): void {
    // 1. تعبئة النص القديم في الـ FormControl للتعليق
    this.editingReplyContent.setValue(reply.content);

    this.editingReplyFile.set(null);
    this.editingReplySrc.set('');
    this.removeCurrentReplyImg.set(false);
    setTimeout(() => initFlowbite(), 0);

    // 3. تحديث الـ Signal لتفعيل وضع التعديل لهذا التعليق فقط
    this.allComments.update((comments) =>
      comments.map((c) => ({
        ...c,
        isEditing: c._id === reply._id, // تفعيل التعديل للعنصر المستهدف وإغلاقه للبقية
      })),
    );
  }

  currentSort = signal('');

  changeSort(sortType: string): void {
    this.currentSort.set(sortType);

    this.allComments.update((comments) => {
      const sortedComments = [...comments];

      switch (sortType) {
        case 'newest':
          sortedComments.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case 'oldest':
          sortedComments.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          break;
        case 'relevant':
        default:
          sortedComments.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
          break;
      }

      return sortedComments;
    });
  }

  emojis = [
    '😀',
    '😂',
    '😍',
    '🥰',
    '😎',
    '🤩',
    '😢',
    '😭',
    '😡',
    '🤔',
    '🙄',
    '😴',
    '🤗',
    '😇',
    '🥳',
    '😜',
    '👍',
    '👎',
    '👏',
    '🙌',
    '🙏',
    '💪',
    '🤝',
    '✌️',
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '💔',
    '🔥',
    '✨',
    '🎉',
    '💯',
    '⭐',
    '⚡',
    '🧠',
    '🩺',
    '🦴',
    '💻',
    '🚀',
    '☕',
    '🌱',
    '🌙',
    '☀️',
    '📚',
  ];

  addEmoji(emoji: string, isEditing: boolean = false, isReply: boolean = false): void {
    if (isEditing && !isReply) {
      this.editingContent.setValue((this.editingContent.value ?? '') + emoji);
    } else if (!isEditing && !isReply) {
      this.commentContent.setValue((this.commentContent.value ?? '') + emoji);
    }

    if (isReply && isEditing) {
      this.editingReplyContent.setValue((this.editingReplyContent.value ?? '') + emoji);
    } else if (isReply && !isEditing) {
      this.replyContent.setValue((this.replyContent.value ?? '') + emoji);
    }
  }
}
