USE [CardGame]
GO

/****** Object:  Table [dbo].[Deck]    Script Date: 8/17/2017 1:15:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Deck](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](30) NOT NULL
) ON [PRIMARY]
GO

