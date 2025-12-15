import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const imagesDir = path.join(uploadDir, 'images')

  diagnostics.uploadDir = uploadDir
  diagnostics.imagesDir = imagesDir

  // Check if directories exist
  try {
    await fs.access(uploadDir)
    diagnostics.uploadDirExists = true
  } catch {
    diagnostics.uploadDirExists = false
  }

  try {
    await fs.access(imagesDir)
    diagnostics.imagesDirExists = true
  } catch {
    diagnostics.imagesDirExists = false
  }

  // Try to create directories if they don't exist
  if (!diagnostics.imagesDirExists) {
    try {
      await fs.mkdir(imagesDir, { recursive: true })
      diagnostics.imagesDirCreated = true
    } catch (error: any) {
      diagnostics.imagesDirCreated = false
      diagnostics.imagesDirCreateError = error.message
    }
  }

  // Try to write a test file
  const testFilePath = path.join(imagesDir, 'test-write.txt')
  try {
    await fs.writeFile(testFilePath, 'test')
    diagnostics.canWriteToImagesDir = true
    
    // Clean up test file
    await fs.unlink(testFilePath)
  } catch (error: any) {
    diagnostics.canWriteToImagesDir = false
    diagnostics.writeError = error.message
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

  return NextResponse.json(diagnostics)
}
