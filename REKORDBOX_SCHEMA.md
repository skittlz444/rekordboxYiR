# Rekordbox Database Schema

## Relational Diagram (Mermaid)
```mermaid
erDiagram
    agentRegistry {
        VARCHAR[255] registry_id PK
        VARCHAR[255] id_1
        VARCHAR[255] id_2
        BIGINT int_1
        BIGINT int_2
        VARCHAR[255] str_1
        VARCHAR[255] str_2
        DATETIME date_1
        DATETIME date_2
        TEXT text_1
        TEXT text_2
        DATETIME created_at
        DATETIME updated_at
    }
    cloudAgentRegistry {
        VARCHAR[255] ID PK
        BIGINT int_1
        BIGINT int_2
        VARCHAR[255] str_1
        VARCHAR[255] str_2
        DATETIME date_1
        DATETIME date_2
        TEXT text_1
        TEXT text_2
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    contentActiveCensor {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        TEXT ActiveCensors
        INTEGER rb_activecensor_count
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    contentCue {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        TEXT Cues
        INTEGER rb_cue_count
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    contentFile {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        VARCHAR[255] Path
        VARCHAR[255] Hash
        INTEGER Size
        VARCHAR[255] rb_local_path
        VARCHAR[255] rb_insync_hash
        BIGINT rb_insync_local_usn
        INTEGER rb_file_hash_dirty
        INTEGER rb_local_file_status
        TINYINT[1] rb_in_progress
        INTEGER rb_process_type
        VARCHAR[255] rb_temp_path
        INTEGER rb_priority
        INTEGER rb_file_size_dirty
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdActiveCensor {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        INTEGER InMsec
        INTEGER OutMsec
        INTEGER Info
        TEXT ParameterList
        VARCHAR[255] ContentUUID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdAlbum {
        VARCHAR[255] ID PK
        VARCHAR[255] Name
        VARCHAR[255] AlbumArtistID
        VARCHAR[255] ImagePath
        INTEGER Compilation
        VARCHAR[255] SearchStr
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdArtist {
        VARCHAR[255] ID PK
        VARCHAR[255] Name
        VARCHAR[255] SearchStr
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdCategory {
        VARCHAR[255] ID PK
        VARCHAR[255] MenuItemID
        INTEGER Seq
        INTEGER Disable
        INTEGER InfoOrder
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdCloudProperty {
        VARCHAR[255] ID PK
        TEXT Reserved1
        TEXT Reserved2
        TEXT Reserved3
        TEXT Reserved4
        TEXT Reserved5
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdColor {
        VARCHAR[255] ID PK
        INTEGER ColorCode
        INTEGER SortKey
        VARCHAR[255] Commnt
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdContent {
        VARCHAR[255] ID PK
        VARCHAR[255] FolderPath
        VARCHAR[255] FileNameL
        VARCHAR[255] FileNameS
        VARCHAR[255] Title
        VARCHAR[255] ArtistID
        VARCHAR[255] AlbumID
        VARCHAR[255] GenreID
        INTEGER BPM
        INTEGER Length
        INTEGER TrackNo
        INTEGER BitRate
        INTEGER BitDepth
        TEXT Commnt
        INTEGER FileType
        INTEGER Rating
        INTEGER ReleaseYear
        VARCHAR[255] RemixerID
        VARCHAR[255] LabelID
        VARCHAR[255] OrgArtistID
        VARCHAR[255] KeyID
        VARCHAR[255] StockDate
        VARCHAR[255] ColorID
        INTEGER DJPlayCount
        VARCHAR[255] ImagePath
        VARCHAR[255] MasterDBID
        VARCHAR[255] MasterSongID
        VARCHAR[255] AnalysisDataPath
        VARCHAR[255] SearchStr
        INTEGER FileSize
        INTEGER DiscNo
        VARCHAR[255] ComposerID
        VARCHAR[255] Subtitle
        INTEGER SampleRate
        INTEGER DisableQuantize
        INTEGER Analysed
        VARCHAR[255] ReleaseDate
        VARCHAR[255] DateCreated
        INTEGER ContentLink
        VARCHAR[255] Tag
        VARCHAR[255] ModifiedByRBM
        VARCHAR[255] HotCueAutoLoad
        VARCHAR[255] DeliveryControl
        VARCHAR[255] DeliveryComment
        VARCHAR[255] CueUpdated
        VARCHAR[255] AnalysisUpdated
        VARCHAR[255] TrackInfoUpdated
        VARCHAR[255] Lyricist
        VARCHAR[255] ISRC
        INTEGER SamplerTrackInfo
        INTEGER SamplerPlayOffset
        FLOAT SamplerGain
        VARCHAR[255] VideoAssociate
        INTEGER LyricStatus
        INTEGER ServiceID
        VARCHAR[255] OrgFolderPath
        TEXT Reserved1
        TEXT Reserved2
        TEXT Reserved3
        TEXT Reserved4
        TEXT ExtInfo
        VARCHAR[255] rb_file_id
        VARCHAR[255] DeviceID
        VARCHAR[255] rb_LocalFolderPath
        VARCHAR[255] SrcID
        VARCHAR[255] SrcTitle
        VARCHAR[255] SrcArtistName
        VARCHAR[255] SrcAlbumName
        INTEGER SrcLength
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdCue {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        INTEGER InMsec
        INTEGER InFrame
        INTEGER InMpegFrame
        INTEGER InMpegAbs
        INTEGER OutMsec
        INTEGER OutFrame
        INTEGER OutMpegFrame
        INTEGER OutMpegAbs
        INTEGER Kind
        INTEGER Color
        INTEGER ColorTableIndex
        INTEGER ActiveLoop
        VARCHAR[255] Comment
        INTEGER BeatLoopSize
        INTEGER CueMicrosec
        VARCHAR[255] InPointSeekInfo
        VARCHAR[255] OutPointSeekInfo
        VARCHAR[255] ContentUUID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdDevice {
        VARCHAR[255] ID PK
        VARCHAR[255] MasterDBID
        VARCHAR[255] Name
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdGenre {
        VARCHAR[255] ID PK
        VARCHAR[255] Name
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdHistory {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        INTEGER Attribute
        VARCHAR[255] ParentID
        VARCHAR[255] DateCreated
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdHotCueBanklist {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        VARCHAR[255] ImagePath
        INTEGER Attribute
        VARCHAR[255] ParentID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdKey {
        VARCHAR[255] ID PK
        VARCHAR[255] ScaleName
        INTEGER Seq
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdLabel {
        VARCHAR[255] ID PK
        VARCHAR[255] Name
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdMenuItems {
        VARCHAR[255] ID PK
        INTEGER Class
        VARCHAR[255] Name
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdMixerParam {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        INTEGER GainHigh
        INTEGER GainLow
        INTEGER PeakHigh
        INTEGER PeakLow
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdMyTag {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        INTEGER Attribute
        VARCHAR[255] ParentID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdPlaylist {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        VARCHAR[255] ImagePath
        INTEGER Attribute
        VARCHAR[255] ParentID
        TEXT SmartList
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdProperty {
        VARCHAR[255] DBID PK
        VARCHAR[255] DBVersion
        VARCHAR[255] BaseDBDrive
        VARCHAR[255] CurrentDBDrive
        VARCHAR[255] DeviceID
        TEXT Reserved1
        TEXT Reserved2
        TEXT Reserved3
        TEXT Reserved4
        TEXT Reserved5
        DATETIME created_at
        DATETIME updated_at
    }
    djmdRecommendLike {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID1
        VARCHAR[255] ContentID2
        INTEGER LikeRate
        INTEGER DataCreatedH
        INTEGER DataCreatedL
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdRelatedTracks {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        INTEGER Attribute
        VARCHAR[255] ParentID
        TEXT Criteria
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSampler {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        INTEGER Attribute
        VARCHAR[255] ParentID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongHistory {
        VARCHAR[255] ID PK
        VARCHAR[255] HistoryID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongHotCueBanklist {
        VARCHAR[255] ID PK
        VARCHAR[255] HotCueBanklistID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] CueID
        INTEGER InMsec
        INTEGER InFrame
        INTEGER InMpegFrame
        INTEGER InMpegAbs
        INTEGER OutMsec
        INTEGER OutFrame
        INTEGER OutMpegFrame
        INTEGER OutMpegAbs
        INTEGER Color
        INTEGER ColorTableIndex
        INTEGER ActiveLoop
        VARCHAR[255] Comment
        INTEGER BeatLoopSize
        INTEGER CueMicrosec
        VARCHAR[255] InPointSeekInfo
        VARCHAR[255] OutPointSeekInfo
        VARCHAR[255] HotCueBanklistUUID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongMyTag {
        VARCHAR[255] ID PK
        VARCHAR[255] MyTagID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongPlaylist {
        VARCHAR[255] ID PK
        VARCHAR[255] PlaylistID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongRelatedTracks {
        VARCHAR[255] ID PK
        VARCHAR[255] RelatedTracksID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongSampler {
        VARCHAR[255] ID PK
        VARCHAR[255] SamplerID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSongTagList {
        VARCHAR[255] ID PK
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSort {
        VARCHAR[255] ID PK
        VARCHAR[255] MenuItemID
        INTEGER Seq
        INTEGER Disable
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    hotCueBanklistCue {
        VARCHAR[255] ID PK
        VARCHAR[255] HotCueBanklistID
        TEXT Cues
        INTEGER rb_cue_count
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    imageFile {
        VARCHAR[255] ID PK
        VARCHAR[255] TableName
        VARCHAR[255] TargetUUID
        VARCHAR[255] TargetID
        VARCHAR[255] Path
        VARCHAR[255] Hash
        INTEGER Size
        VARCHAR[255] rb_local_path
        VARCHAR[255] rb_insync_hash
        BIGINT rb_insync_local_usn
        INTEGER rb_file_hash_dirty
        INTEGER rb_local_file_status
        TINYINT[1] rb_in_progress
        INTEGER rb_process_type
        VARCHAR[255] rb_temp_path
        INTEGER rb_priority
        INTEGER rb_file_size_dirty
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    settingFile {
        VARCHAR[255] ID PK
        VARCHAR[255] Path
        VARCHAR[255] Hash
        INTEGER Size
        VARCHAR[255] rb_local_path
        VARCHAR[255] rb_insync_hash
        BIGINT rb_insync_local_usn
        INTEGER rb_file_hash_dirty
        INTEGER rb_file_size_dirty
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    uuidIDMap {
        VARCHAR[255] ID PK
        VARCHAR[255] TableName
        VARCHAR[255] TargetUUID
        VARCHAR[255] CurrentID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    agentNotification {
        BIGINT ID PK
        TINYINT[1] graphic_area
        TINYINT[1] text_area
        TINYINT[1] os_notification
        DATETIME start_datetime
        DATETIME end_datetime
        DATETIME display_datetime
        INTEGER interval
        VARCHAR[255] category
        VARCHAR[255] category_color
        TEXT title
        TEXT description
        VARCHAR[255] url
        VARCHAR[255] image
        VARCHAR[255] image_path
        INTEGER read_status
        DATETIME last_displayed_datetime
        DATETIME created_at
        DATETIME updated_at
    }
    agentNotificationLog {
        INTEGER ID PK
        VARCHAR[255] gigya_uid
        INTEGER event_date
        DATETIME reported_datetime
        INTEGER kind
        INTEGER value
        BIGINT notification_id
        VARCHAR[255] link
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSharedPlaylist {
        VARCHAR[255] ID PK
        TINYINT data_selection
        DATETIME edited_at
        INTEGER int_1
        INTEGER int_2
        VARCHAR[255] str_1
        VARCHAR[255] str_2
        TEXT text_1
        TEXT text_2
        DATETIME created_at
        DATETIME updated_at
    }
    djmdSharedPlaylistUser {
        VARCHAR[255] ID PK
        TINYINT member_type
        VARCHAR[255] member_id
        TINYINT status
        DATETIME invitation_expires_at
        DATETIME invited_at
        DATETIME joined_at
        INTEGER int_1
        INTEGER int_2
        VARCHAR[255] str_1
        VARCHAR[255] str_2
        TEXT text_1
        TEXT text_2
        DATETIME created_at
        DATETIME updated_at
    }
    djmdCloudExportPlaylist {
        VARCHAR[255] ID PK
        INTEGER Seq
        VARCHAR[255] Name
        VARCHAR[255] ImagePath
        INTEGER Attribute
        VARCHAR[255] ParentID
        TEXT SmartList
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdCloudExportSongPlaylist {
        VARCHAR[255] ID PK
        VARCHAR[255] CloudExportPlaylistID
        VARCHAR[255] ContentID
        INTEGER TrackNo
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdCloudFilterPlaylist {
        VARCHAR[255] ID PK
        VARCHAR[255] PlaylistUUID
        INTEGER Seq
        VARCHAR[255] ParentID
        VARCHAR[255] UUID
        INTEGER rb_data_status
        INTEGER rb_local_data_status
        TINYINT[1] rb_local_deleted
        TINYINT[1] rb_local_synced
        BIGINT usn
        BIGINT rb_local_usn
        DATETIME created_at
        DATETIME updated_at
    }
    djmdContent ||--o{ contentActiveCensor : "ContentID"
    djmdContent ||--o{ contentCue : "ContentID"
    djmdContent ||--o{ contentFile : "ContentID"
    djmdContent ||--o{ djmdActiveCensor : "ContentID"
    djmdArtist ||--o{ djmdContent : "ArtistID"
    djmdAlbum ||--o{ djmdContent : "AlbumID"
    djmdGenre ||--o{ djmdContent : "GenreID"
    djmdArtist ||--o{ djmdContent : "RemixerID"
    djmdLabel ||--o{ djmdContent : "LabelID"
    djmdArtist ||--o{ djmdContent : "OrgArtistID"
    djmdKey ||--o{ djmdContent : "KeyID"
    djmdColor ||--o{ djmdContent : "ColorID"
    djmdArtist ||--o{ djmdContent : "ComposerID"
    djmdDevice ||--o{ djmdContent : "DeviceID"
    djmdContent ||--o{ djmdCue : "ContentID"
    djmdContent ||--o{ djmdMixerParam : "ContentID"
    djmdDevice ||--o{ djmdProperty : "DeviceID"
    djmdHistory ||--o{ djmdSongHistory : "HistoryID"
    djmdContent ||--o{ djmdSongHistory : "ContentID"
    djmdHotCueBanklist ||--o{ djmdSongHotCueBanklist : "HotCueBanklistID"
    djmdContent ||--o{ djmdSongHotCueBanklist : "ContentID"
    djmdCue ||--o{ djmdSongHotCueBanklist : "CueID"
    djmdMyTag ||--o{ djmdSongMyTag : "MyTagID"
    djmdContent ||--o{ djmdSongMyTag : "ContentID"
    djmdPlaylist ||--o{ djmdSongPlaylist : "PlaylistID"
    djmdContent ||--o{ djmdSongPlaylist : "ContentID"
    djmdRelatedTracks ||--o{ djmdSongRelatedTracks : "RelatedTracksID"
    djmdContent ||--o{ djmdSongRelatedTracks : "ContentID"
    djmdSampler ||--o{ djmdSongSampler : "SamplerID"
    djmdContent ||--o{ djmdSongSampler : "ContentID"
    djmdContent ||--o{ djmdSongTagList : "ContentID"
    djmdHotCueBanklist ||--o{ hotCueBanklistCue : "HotCueBanklistID"
    djmdCloudExportPlaylist ||--o{ djmdCloudExportSongPlaylist : "CloudExportPlaylistID"
    djmdContent ||--o{ djmdCloudExportSongPlaylist : "ContentID"
```

## Table Details
### Table: agentRegistry
| Column | Type | Not Null | PK |
|---|---|---|---|
| registry_id | VARCHAR(255) | 0 | 1 |
| id_1 | VARCHAR(255) | 0 | 0 |
| id_2 | VARCHAR(255) | 0 | 0 |
| int_1 | BIGINT | 0 | 0 |
| int_2 | BIGINT | 0 | 0 |
| str_1 | VARCHAR(255) | 0 | 0 |
| str_2 | VARCHAR(255) | 0 | 0 |
| date_1 | DATETIME | 0 | 0 |
| date_2 | DATETIME | 0 | 0 |
| text_1 | TEXT | 0 | 0 |
| text_2 | TEXT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: cloudAgentRegistry
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| int_1 | BIGINT | 0 | 0 |
| int_2 | BIGINT | 0 | 0 |
| str_1 | VARCHAR(255) | 0 | 0 |
| str_2 | VARCHAR(255) | 0 | 0 |
| date_1 | DATETIME | 0 | 0 |
| date_2 | DATETIME | 0 | 0 |
| text_1 | TEXT | 0 | 0 |
| text_2 | TEXT | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: contentActiveCensor
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| ActiveCensors | TEXT | 0 | 0 |
| rb_activecensor_count | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: contentCue
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| Cues | TEXT | 0 | 0 |
| rb_cue_count | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: contentFile
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| Path | VARCHAR(255) | 0 | 0 |
| Hash | VARCHAR(255) | 0 | 0 |
| Size | INTEGER | 0 | 0 |
| rb_local_path | VARCHAR(255) | 0 | 0 |
| rb_insync_hash | VARCHAR(255) | 0 | 0 |
| rb_insync_local_usn | BIGINT | 0 | 0 |
| rb_file_hash_dirty | INTEGER | 0 | 0 |
| rb_local_file_status | INTEGER | 0 | 0 |
| rb_in_progress | TINYINT(1) | 0 | 0 |
| rb_process_type | INTEGER | 0 | 0 |
| rb_temp_path | VARCHAR(255) | 0 | 0 |
| rb_priority | INTEGER | 0 | 0 |
| rb_file_size_dirty | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdActiveCensor
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| InMsec | INTEGER | 0 | 0 |
| OutMsec | INTEGER | 0 | 0 |
| Info | INTEGER | 0 | 0 |
| ParameterList | TEXT | 0 | 0 |
| ContentUUID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdAlbum
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Name | VARCHAR(255) | 0 | 0 |
| AlbumArtistID | VARCHAR(255) | 0 | 0 |
| ImagePath | VARCHAR(255) | 0 | 0 |
| Compilation | INTEGER | 0 | 0 |
| SearchStr | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdArtist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Name | VARCHAR(255) | 0 | 0 |
| SearchStr | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdCategory
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| MenuItemID | VARCHAR(255) | 0 | 0 |
| Seq | INTEGER | 0 | 0 |
| Disable | INTEGER | 0 | 0 |
| InfoOrder | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdCloudProperty
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Reserved1 | TEXT | 0 | 0 |
| Reserved2 | TEXT | 0 | 0 |
| Reserved3 | TEXT | 0 | 0 |
| Reserved4 | TEXT | 0 | 0 |
| Reserved5 | TEXT | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdColor
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ColorCode | INTEGER | 0 | 0 |
| SortKey | INTEGER | 0 | 0 |
| Commnt | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdContent
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| FolderPath | VARCHAR(255) | 0 | 0 |
| FileNameL | VARCHAR(255) | 0 | 0 |
| FileNameS | VARCHAR(255) | 0 | 0 |
| Title | VARCHAR(255) | 0 | 0 |
| ArtistID | VARCHAR(255) | 0 | 0 |
| AlbumID | VARCHAR(255) | 0 | 0 |
| GenreID | VARCHAR(255) | 0 | 0 |
| BPM | INTEGER | 0 | 0 |
| Length | INTEGER | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| BitRate | INTEGER | 0 | 0 |
| BitDepth | INTEGER | 0 | 0 |
| Commnt | TEXT | 0 | 0 |
| FileType | INTEGER | 0 | 0 |
| Rating | INTEGER | 0 | 0 |
| ReleaseYear | INTEGER | 0 | 0 |
| RemixerID | VARCHAR(255) | 0 | 0 |
| LabelID | VARCHAR(255) | 0 | 0 |
| OrgArtistID | VARCHAR(255) | 0 | 0 |
| KeyID | VARCHAR(255) | 0 | 0 |
| StockDate | VARCHAR(255) | 0 | 0 |
| ColorID | VARCHAR(255) | 0 | 0 |
| DJPlayCount | INTEGER | 0 | 0 |
| ImagePath | VARCHAR(255) | 0 | 0 |
| MasterDBID | VARCHAR(255) | 0 | 0 |
| MasterSongID | VARCHAR(255) | 0 | 0 |
| AnalysisDataPath | VARCHAR(255) | 0 | 0 |
| SearchStr | VARCHAR(255) | 0 | 0 |
| FileSize | INTEGER | 0 | 0 |
| DiscNo | INTEGER | 0 | 0 |
| ComposerID | VARCHAR(255) | 0 | 0 |
| Subtitle | VARCHAR(255) | 0 | 0 |
| SampleRate | INTEGER | 0 | 0 |
| DisableQuantize | INTEGER | 0 | 0 |
| Analysed | INTEGER | 0 | 0 |
| ReleaseDate | VARCHAR(255) | 0 | 0 |
| DateCreated | VARCHAR(255) | 0 | 0 |
| ContentLink | INTEGER | 0 | 0 |
| Tag | VARCHAR(255) | 0 | 0 |
| ModifiedByRBM | VARCHAR(255) | 0 | 0 |
| HotCueAutoLoad | VARCHAR(255) | 0 | 0 |
| DeliveryControl | VARCHAR(255) | 0 | 0 |
| DeliveryComment | VARCHAR(255) | 0 | 0 |
| CueUpdated | VARCHAR(255) | 0 | 0 |
| AnalysisUpdated | VARCHAR(255) | 0 | 0 |
| TrackInfoUpdated | VARCHAR(255) | 0 | 0 |
| Lyricist | VARCHAR(255) | 0 | 0 |
| ISRC | VARCHAR(255) | 0 | 0 |
| SamplerTrackInfo | INTEGER | 0 | 0 |
| SamplerPlayOffset | INTEGER | 0 | 0 |
| SamplerGain | FLOAT | 0 | 0 |
| VideoAssociate | VARCHAR(255) | 0 | 0 |
| LyricStatus | INTEGER | 0 | 0 |
| ServiceID | INTEGER | 0 | 0 |
| OrgFolderPath | VARCHAR(255) | 0 | 0 |
| Reserved1 | TEXT | 0 | 0 |
| Reserved2 | TEXT | 0 | 0 |
| Reserved3 | TEXT | 0 | 0 |
| Reserved4 | TEXT | 0 | 0 |
| ExtInfo | TEXT | 0 | 0 |
| rb_file_id | VARCHAR(255) | 0 | 0 |
| DeviceID | VARCHAR(255) | 0 | 0 |
| rb_LocalFolderPath | VARCHAR(255) | 0 | 0 |
| SrcID | VARCHAR(255) | 0 | 0 |
| SrcTitle | VARCHAR(255) | 0 | 0 |
| SrcArtistName | VARCHAR(255) | 0 | 0 |
| SrcAlbumName | VARCHAR(255) | 0 | 0 |
| SrcLength | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdCue
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| InMsec | INTEGER | 0 | 0 |
| InFrame | INTEGER | 0 | 0 |
| InMpegFrame | INTEGER | 0 | 0 |
| InMpegAbs | INTEGER | 0 | 0 |
| OutMsec | INTEGER | 0 | 0 |
| OutFrame | INTEGER | 0 | 0 |
| OutMpegFrame | INTEGER | 0 | 0 |
| OutMpegAbs | INTEGER | 0 | 0 |
| Kind | INTEGER | 0 | 0 |
| Color | INTEGER | 0 | 0 |
| ColorTableIndex | INTEGER | 0 | 0 |
| ActiveLoop | INTEGER | 0 | 0 |
| Comment | VARCHAR(255) | 0 | 0 |
| BeatLoopSize | INTEGER | 0 | 0 |
| CueMicrosec | INTEGER | 0 | 0 |
| InPointSeekInfo | VARCHAR(255) | 0 | 0 |
| OutPointSeekInfo | VARCHAR(255) | 0 | 0 |
| ContentUUID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdDevice
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| MasterDBID | VARCHAR(255) | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdGenre
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Name | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdHistory
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| DateCreated | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdHotCueBanklist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| ImagePath | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdKey
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ScaleName | VARCHAR(255) | 0 | 0 |
| Seq | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdLabel
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Name | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdMenuItems
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Class | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdMixerParam
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| GainHigh | INTEGER | 0 | 0 |
| GainLow | INTEGER | 0 | 0 |
| PeakHigh | INTEGER | 0 | 0 |
| PeakLow | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdMyTag
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdPlaylist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| ImagePath | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| SmartList | TEXT | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdProperty
| Column | Type | Not Null | PK |
|---|---|---|---|
| DBID | VARCHAR(255) | 0 | 1 |
| DBVersion | VARCHAR(255) | 0 | 0 |
| BaseDBDrive | VARCHAR(255) | 0 | 0 |
| CurrentDBDrive | VARCHAR(255) | 0 | 0 |
| DeviceID | VARCHAR(255) | 0 | 0 |
| Reserved1 | TEXT | 0 | 0 |
| Reserved2 | TEXT | 0 | 0 |
| Reserved3 | TEXT | 0 | 0 |
| Reserved4 | TEXT | 0 | 0 |
| Reserved5 | TEXT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdRecommendLike
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID1 | VARCHAR(255) | 0 | 0 |
| ContentID2 | VARCHAR(255) | 0 | 0 |
| LikeRate | INTEGER | 0 | 0 |
| DataCreatedH | INTEGER | 0 | 0 |
| DataCreatedL | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdRelatedTracks
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| Criteria | TEXT | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSampler
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongHistory
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| HistoryID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongHotCueBanklist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| HotCueBanklistID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| CueID | VARCHAR(255) | 0 | 0 |
| InMsec | INTEGER | 0 | 0 |
| InFrame | INTEGER | 0 | 0 |
| InMpegFrame | INTEGER | 0 | 0 |
| InMpegAbs | INTEGER | 0 | 0 |
| OutMsec | INTEGER | 0 | 0 |
| OutFrame | INTEGER | 0 | 0 |
| OutMpegFrame | INTEGER | 0 | 0 |
| OutMpegAbs | INTEGER | 0 | 0 |
| Color | INTEGER | 0 | 0 |
| ColorTableIndex | INTEGER | 0 | 0 |
| ActiveLoop | INTEGER | 0 | 0 |
| Comment | VARCHAR(255) | 0 | 0 |
| BeatLoopSize | INTEGER | 0 | 0 |
| CueMicrosec | INTEGER | 0 | 0 |
| InPointSeekInfo | VARCHAR(255) | 0 | 0 |
| OutPointSeekInfo | VARCHAR(255) | 0 | 0 |
| HotCueBanklistUUID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongMyTag
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| MyTagID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongPlaylist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| PlaylistID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongRelatedTracks
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| RelatedTracksID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongSampler
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| SamplerID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSongTagList
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSort
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| MenuItemID | VARCHAR(255) | 0 | 0 |
| Seq | INTEGER | 0 | 0 |
| Disable | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: hotCueBanklistCue
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| HotCueBanklistID | VARCHAR(255) | 0 | 0 |
| Cues | TEXT | 0 | 0 |
| rb_cue_count | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: imageFile
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| TableName | VARCHAR(255) | 0 | 0 |
| TargetUUID | VARCHAR(255) | 0 | 0 |
| TargetID | VARCHAR(255) | 0 | 0 |
| Path | VARCHAR(255) | 0 | 0 |
| Hash | VARCHAR(255) | 0 | 0 |
| Size | INTEGER | 0 | 0 |
| rb_local_path | VARCHAR(255) | 0 | 0 |
| rb_insync_hash | VARCHAR(255) | 0 | 0 |
| rb_insync_local_usn | BIGINT | 0 | 0 |
| rb_file_hash_dirty | INTEGER | 0 | 0 |
| rb_local_file_status | INTEGER | 0 | 0 |
| rb_in_progress | TINYINT(1) | 0 | 0 |
| rb_process_type | INTEGER | 0 | 0 |
| rb_temp_path | VARCHAR(255) | 0 | 0 |
| rb_priority | INTEGER | 0 | 0 |
| rb_file_size_dirty | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: settingFile
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Path | VARCHAR(255) | 0 | 0 |
| Hash | VARCHAR(255) | 0 | 0 |
| Size | INTEGER | 0 | 0 |
| rb_local_path | VARCHAR(255) | 0 | 0 |
| rb_insync_hash | VARCHAR(255) | 0 | 0 |
| rb_insync_local_usn | BIGINT | 0 | 0 |
| rb_file_hash_dirty | INTEGER | 0 | 0 |
| rb_file_size_dirty | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: uuidIDMap
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| TableName | VARCHAR(255) | 0 | 0 |
| TargetUUID | VARCHAR(255) | 0 | 0 |
| CurrentID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: agentNotification
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | BIGINT | 0 | 1 |
| graphic_area | TINYINT(1) | 0 | 0 |
| text_area | TINYINT(1) | 0 | 0 |
| os_notification | TINYINT(1) | 0 | 0 |
| start_datetime | DATETIME | 0 | 0 |
| end_datetime | DATETIME | 0 | 0 |
| display_datetime | DATETIME | 0 | 0 |
| interval | INTEGER | 0 | 0 |
| category | VARCHAR(255) | 0 | 0 |
| category_color | VARCHAR(255) | 0 | 0 |
| title | TEXT | 0 | 0 |
| description | TEXT | 0 | 0 |
| url | VARCHAR(255) | 0 | 0 |
| image | VARCHAR(255) | 0 | 0 |
| image_path | VARCHAR(255) | 0 | 0 |
| read_status | INTEGER | 0 | 0 |
| last_displayed_datetime | DATETIME | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: agentNotificationLog
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | INTEGER | 0 | 1 |
| gigya_uid | VARCHAR(255) | 0 | 0 |
| event_date | INTEGER | 0 | 0 |
| reported_datetime | DATETIME | 0 | 0 |
| kind | INTEGER | 0 | 0 |
| value | INTEGER | 0 | 0 |
| notification_id | BIGINT | 0 | 0 |
| link | VARCHAR(255) | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSharedPlaylist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| data_selection | TINYINT | 0 | 0 |
| edited_at | DATETIME | 0 | 0 |
| int_1 | INTEGER | 0 | 0 |
| int_2 | INTEGER | 0 | 0 |
| str_1 | VARCHAR(255) | 0 | 0 |
| str_2 | VARCHAR(255) | 0 | 0 |
| text_1 | TEXT | 0 | 0 |
| text_2 | TEXT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdSharedPlaylistUser
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 1 | 1 |
| member_type | TINYINT | 0 | 0 |
| member_id | VARCHAR(255) | 1 | 2 |
| status | TINYINT | 0 | 0 |
| invitation_expires_at | DATETIME | 0 | 0 |
| invited_at | DATETIME | 0 | 0 |
| joined_at | DATETIME | 0 | 0 |
| int_1 | INTEGER | 0 | 0 |
| int_2 | INTEGER | 0 | 0 |
| str_1 | VARCHAR(255) | 0 | 0 |
| str_2 | VARCHAR(255) | 0 | 0 |
| text_1 | TEXT | 0 | 0 |
| text_2 | TEXT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdCloudExportPlaylist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| Seq | INTEGER | 0 | 0 |
| Name | VARCHAR(255) | 0 | 0 |
| ImagePath | VARCHAR(255) | 0 | 0 |
| Attribute | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| SmartList | TEXT | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdCloudExportSongPlaylist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| CloudExportPlaylistID | VARCHAR(255) | 0 | 0 |
| ContentID | VARCHAR(255) | 0 | 0 |
| TrackNo | INTEGER | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |

### Table: djmdCloudFilterPlaylist
| Column | Type | Not Null | PK |
|---|---|---|---|
| ID | VARCHAR(255) | 0 | 1 |
| PlaylistUUID | VARCHAR(255) | 0 | 0 |
| Seq | INTEGER | 0 | 0 |
| ParentID | VARCHAR(255) | 0 | 0 |
| UUID | VARCHAR(255) | 0 | 0 |
| rb_data_status | INTEGER | 0 | 0 |
| rb_local_data_status | INTEGER | 0 | 0 |
| rb_local_deleted | TINYINT(1) | 0 | 0 |
| rb_local_synced | TINYINT(1) | 0 | 0 |
| usn | BIGINT | 0 | 0 |
| rb_local_usn | BIGINT | 0 | 0 |
| created_at | DATETIME | 1 | 0 |
| updated_at | DATETIME | 1 | 0 |


