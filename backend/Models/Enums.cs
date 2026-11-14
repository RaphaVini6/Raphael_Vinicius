namespace Backend.Models;

public enum Destination { Moon, Mars, Asteroid, DeepSpace }
public enum ProbeStatus { Active, Inactive, Lost }
public enum ProbeType { Lander, Rover, Helicopter, AscentStage, Orbiter, ScientificPackage, Memorial, Debris, SpaceProbe, Telescope }
public enum HardwareCategory { Power, Storage, Thermal, Mobility, Communication, Computer }
public enum Reliability { Confirmed, Estimated }

// what the main date of a probe means
public enum DateKind { Landing, Deployment, Discarded, Impact, OrbitInsertion, FirstFlight, JupiterFlyby, Retirement }
