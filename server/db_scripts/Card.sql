USE [CardGame]
GO

/****** Object:  Table [dbo].[Card]    Script Date: 01-Aug-17 10:56:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Card](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CardTypeId] [int] NOT NULL,
	[UserId] [int] NOT NULL
) ON [PRIMARY]
GO


