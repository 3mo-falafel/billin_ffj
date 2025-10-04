#!/usr/bin/env node

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'iyadSK2008';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this in your SQL:');
  console.log(`'${hash}'`);
}

generateHash();
