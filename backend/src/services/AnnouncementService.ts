import mongoose from "mongoose";
import { AnnouncementModel, IAnnouncement } from "../models/Announcement";

interface CreateAnnouncementDTO {
  userId:    string;
  title:     string;
  body:      string;
  isPinned?: boolean;
}

export class AnnouncementService {

  async create(dto: CreateAnnouncementDTO): Promise<IAnnouncement> {
    if (!dto.title.trim() || !dto.body.trim()) {
      throw new Error("title and body are required");
    }
    return AnnouncementModel.create({
      userId:   new mongoose.Types.ObjectId(dto.userId),
      title:    dto.title.trim(),
      body:     dto.body.trim(),
      isPinned: dto.isPinned ?? false,
    });
  }

  async getAll(): Promise<IAnnouncement[]> {
    
    return AnnouncementModel.find().sort({ isPinned: -1, createdAt: -1 });
  }

  async getById(announcementId: string): Promise<IAnnouncement> {
    const ann = await AnnouncementModel.findById(announcementId);
    if (!ann) throw new Error(`Announcement ${announcementId} not found`);
    return ann;
  }

  async togglePin(announcementId: string): Promise<IAnnouncement> {
    const ann = await this.getById(announcementId);
    const updated = await AnnouncementModel.findByIdAndUpdate(
      announcementId,
      { $set: { isPinned: !ann.isPinned } },
      { new: true }
    );
    if (!updated) throw new Error(`Announcement ${announcementId} not found`);
    return updated;
  }

  async delete(announcementId: string): Promise<void> {
    const result = await AnnouncementModel.findByIdAndDelete(announcementId);
    if (!result) throw new Error(`Announcement ${announcementId} not found`);
  }
}

export const announcementService = new AnnouncementService();