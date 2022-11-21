#!/usr/bin/env node
//     #!/bin/bash


const rimraf = require('rimraf')
const chalk = require('chalk')
const fs = require("fs");

const testResultsDir = '../results/cypress'

rimraf(testResultsDir, () => {
  console.info(chalk.yellow('    Deleted former test results.'))
})