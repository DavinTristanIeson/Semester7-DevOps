function assertEnvExists(name: string, value: any) {
  if (value == null) {
    throw new Error(`${name} doesn't exist in .env.local`)
  }
  return value;
}

const EnvironmentVariables = {
  ApiUrl: assertEnvExists("API_URL", process.env.API_URL),
}

export default EnvironmentVariables;