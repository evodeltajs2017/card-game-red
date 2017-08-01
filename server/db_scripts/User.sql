USE [CardGame]
GO

/****** Object:  Table [dbo].[User]    Script Date: 01-Aug-17 10:57:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UnopenedCardPacks] [int] NOT NULL
) ON [PRIMARY]
GO


