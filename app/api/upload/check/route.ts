import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    platform: process.platform,
    nodeVersion: process.version,
  }

  // Check if Sharp is working
  try {
    const sharp = require('sharp')
    diagnostics.sharpVersion = sharp.versions?.sharp || 'unknown'
    diagnostics.sharpInstalled = true
    
    // Try a simple Sharp operation
    const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
    const result = await sharp(testBuffer).metadata()
    diagnostics.sharpWorking = true
    diagnostics.sharpTestResult = result
  } catch (error: any) {
    diagnostics.sharpInstalled = false
    diagnostics.sharpError = error.message
    diagnostics.sharpWorking = false
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const imagesDir = path.join(uploadDir, 'images')
  const publicDir = path.join(process.cwd(), 'public')

  diagnostics.publicDir = publicDir
  diagnostics.uploadDir = uploadDir
  diagnostics.imagesDir = imagesDir

  // Check if public directory exists
  diagnostics.publicDirExists = existsSync(publicDir)
  
  // List contents of public directory
  try {
    const publicContents = await fs.readdir(publicDir)
    diagnostics.publicDirContents = publicContents.slice(0, 30)
  } catch (error: any) {
    diagnostics.publicDirContentsError = error.message
  }

  // Check if directories exist
  diagnostics.uploadDirExists = existsSync(uploadDir)
  diagnostics.imagesDirExists = existsSync(imagesDir)

  // Try to create directories if they don't exist
  if (!diagnostics.imagesDirExists) {
    try {
      await fs.mkdir(imagesDir, { recursive: true })
      diagnostics.imagesDirCreated = true
      diagnostics.imagesDirExistsAfterCreate = existsSync(imagesDir)
    } catch (error: any) {
      diagnostics.imagesDirCreated = false
      diagnostics.imagesDirCreateError = error.message
      diagnostics.imagesDirCreateErrorCode = error.code
    }
  }

  // Try to write a test file
  const testFilePath = path.join(imagesDir, 'test-write-' + Date.now() + '.txt')
  try {
    await fs.writeFile(testFilePath, 'test content at ' + new Date().toISOString())
    diagnostics.canWriteToImagesDir = true
    diagnostics.testFilePath = testFilePath
    
    // Verify the file exists
    const testFileExists = existsSync(testFilePath)
    diagnostics.testFileExistsAfterWrite = testFileExists
    
    if (testFileExists) {
      const testFileContent = await fs.readFile(testFilePath, 'utf-8')
      diagnostics.testFileContent = testFileContent
    }
    
    // Clean up test file
    await fs.unlink(testFilePath)
    diagnostics.testFileDeleted = true
  } catch (error: any) {
    diagnostics.canWriteToImagesDir = false
    diagnostics.writeError = error.message
    diagnostics.writeErrorCode = error.code
  }

  // List files in images directory
  try {
    const files = await fs.readdir(imagesDir)
    diagnostics.filesInImagesDir = files.slice(0, 20) // First 20 files
    diagnostics.totalFilesCount = files.length
  } catch (error: any) {
    diagnostics.filesInImagesDir = []
    diagnostics.listFilesError = error.message
  }

  return NextResponse.json(diagnostics, { 
    headers: { 'Content-Type': 'application/json' }
  })
}
