export interface ReviewResponseDto {
  id: number;
  stallId: number;
  userId: number;
  userName: string; // hasil JOIN ke USERS
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | null;
}
