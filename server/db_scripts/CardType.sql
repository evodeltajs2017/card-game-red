USE [CardGame]
GO

/****** Object:  Table [dbo].[CardType]    Script Date: 01-Aug-17 10:57:45 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CardType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
	[Cost] [int] NOT NULL,
	[Damage] [int] NOT NULL,
	[Health] [int] NOT NULL,
	[ImageIdentifier] [nvarchar](30) NOT NULL
) ON [PRIMARY]
GO


