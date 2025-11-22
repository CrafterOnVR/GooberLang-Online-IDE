import { DocItem, Lesson, EasterEgg } from './types';

export const DEFAULT_CODE = `// GooberLang v4.5 - Project: "NeuroGenesis"
// Interactive HiveMind with Live User Control

GB.Utils.log("Initializing NeuroGenesis Kernel...");
var timer = GB.Utils.timer();

var hive = GB.hive.HiveMind("OmniBrain_Alpha", {
  capacity: 12000,
  plasticity: 0.98
});
GB.Utils.log(\`HiveMind '\${hive.name}' online. Status: WAITING_FOR_INPUT\`);

var agent = GB.Modules.Transformer({
  layers: 8,
  heads: 12,
  dim: 768,
  activation: "gelu_new"
});

var acha = GB.ACHA.createCoder({
  latent_dim: 256,
  strategy: "generative_replay"
});

var globalStep = 0;
var anomaly_active = false;
var learning_rate = 0.001;

GB.Utils.log(">>> SYSTEM READY. Use the Control Panel to guide evolution.");

while (true) {
  var signal = GB.Control.getSignal();
  
  if (signal === "STOP") {
    GB.Utils.log(">>> STOP SIGNAL RECEIVED. Finalizing weights and shutting down...");
    GB.saveModel(agent, "final_checkpoint.gb");
    break; 
  }
  
  if (signal === "BOOST_LR") {
    learning_rate = 0.05;
    GB.Utils.log(">>> COMMAND: Learning Rate Boosted! Plasticity increasing.");
  } else if (learning_rate > 0.001) {
    learning_rate *= 0.9;
  }

  if (signal === "TRIGGER_ANOMALY") {
    anomaly_active = true;
    GB.Utils.log(">>> WARNING: External Anomaly Injected into Input Stream!");
  }

  if (signal === "SAVE_CHECKPOINT") {
    GB.Utils.log(">>> COMMAND: Snapshot saved to secure storage.");
  }

  var sparring_intensity = anomaly_active ? 0.95 : 0.3;
  if (signal === "SPAR_INTENSE") {
    sparring_intensity = 1.0;
    GB.Utils.log(">>> COMMAND: MAX INTENSITY SPARRING ENGAGED.");
  }

  var sparring = GB.ACHA.spar(acha, agent, {
    intensity: sparring_intensity,
    mode: "adversarial"
  });

  var noise = GB.RandomOps.normal(0, 0.02);
  var base_loss = Math.exp(-globalStep/50);
  var loss = Math.max(0.01, base_loss + (anomaly_active ? 0.4 : 0) + noise);
  
  if (anomaly_active && Math.random() > 0.8) anomaly_active = false;

  var accuracy = Math.min(0.99, 1.0 - loss + (sparring.win_rate * 0.15));

  if (globalStep % 5 === 0) {
     GB.Utils.log(\`[Step \${globalStep}] LR: \${learning_rate.toFixed(4)} | Loss: \${loss.toFixed(3)} | Sparring Win: \${(sparring.win_rate*100).toFixed(1)}%\`);
  }

  GB.Visual.plot({
    title: "Live Neural Metrics",
    xAxisKey: "step",
    type: "area",
    series: [
      { key: "accuracy", color: "#34d399", name: "Accuracy" },
      { key: "loss", color: "#f87171", name: "Loss" }
    ],
    data: [{
      step: globalStep,
      loss: loss,
      accuracy: accuracy,
      win_rate: sparring.win_rate
    }]
  });

  GB.Visual.plot({
    title: "Sparring Analysis",
    xAxisKey: "step",
    type: "line",
    series: [
      { key: "win_rate", color: "#f97316", name: "Win Rate" },
      { key: "retention", color: "#8b5cf6", name: "Retention" }
    ],
    data: [{
      step: globalStep,
      win_rate: sparring.win_rate,
      retention: sparring.retention
    }]
  });

  globalStep++;
  GB.Utils.sleep(100);
}

GB.Utils.log("System Shutdown Complete.");
`;

export const LLM_CODE = `// GooberLang v4.5 - Project: "HiveMind LLM"
// Interactive Large Language Model Training

GB.Utils.log("Initializing LLM Matrix...");
var llm_brain = GB.hive.HiveMind("GPT_Goober_Infinity", { type: "causal_decoder", vocab_size: 50257 });

var steps = 0;
var perplexity = 25.0;
var drift = 0.0;

GB.Utils.log(">>> LLM PRE-TRAINING STARTED. Waiting for Supervisor Commands...");

while (true) {
  var sig = GB.Control.getSignal();

  if (sig === "STOP") {
    GB.Utils.log(">>> SUPERVISOR: Halting Training. Saving State...");
    break;
  }

  if (sig === "TRIGGER_ANOMALY") {
    GB.Utils.log(">>> DETECTED: Semantic Drift in Training Data!");
    drift += 5.0;
  }

  if (sig === "SPAR_INTENSE") {
    GB.Utils.log(">>> ACTION: Engaging ACHA/Replay to fix drift.");
    drift = Math.max(0, drift - 2.0);
  }

  perplexity = Math.max(1.0, (perplexity * 0.99) + (drift * 0.1) + (Math.random() - 0.5));
  if (drift > 0) drift *= 0.95;

  if (steps % 2 === 0) {
    GB.Utils.log(\`[Batch \${steps}] PPL: \${perplexity.toFixed(2)} | Drift: \${drift.toFixed(2)}\`);
  }

  GB.Visual.plot({
    title: "LLM Training Dynamics",
    xAxisKey: "step",
    type: "line",
    series: [
      { key: "perplexity", color: "#60a5fa", name: "Perplexity" },
      { key: "drift", color: "#facc15", name: "Semantic Drift" }
    ],
    data: [{
      step: steps,
      perplexity: perplexity,
      drift: drift
    }]
  });

  steps++;
  GB.Utils.sleep(50);
}
GB.Utils.log("LLM Offline.");
`;

export const AGI_CODE = `// GooberLang Project: AGI "The Singularity"
// Self-Improving HiveMind with Automated Evolution Strategy

GB.Utils.log(">>> BOOT SEQUENCE INITIATED: AGI CORE");

var agi_core = GB.loadModel("agi_brain.ckpt");
if (!agi_core) {
  GB.Utils.log("No existing consciousness found. Birthing new HiveMind...");
  agi_core = GB.hive.HiveMind("Singularity_Zero", {
    modules: ["vision", "logic", "coding", "creative"],
    initial_iq: 140,
    plasticity: 1.0
  });
}

var coder = GB.ACHA.createCoder({ mode: "continuous_self_improve" });
var step = 0;
var iq = 140.0;
var knowledge_breadth = 1000;
var is_paused = false;

GB.Utils.log(">>> SYSTEM ONLINE. Auto-Evolution Mode: ENGAGED.");

while(true) {
  var sig = GB.Control.getSignal();
  
  if (sig === "PAUSE") { if (!is_paused) GB.Utils.log(">>> PAUSING EVOLUTION."); is_paused = true; }
  if (sig === "RESUME") { if (is_paused) GB.Utils.log(">>> RESUMING EVOLUTION."); is_paused = false; }
  
  if (is_paused) { GB.Utils.sleep(1000); continue; }

  if (sig === "STOP") {
    GB.Utils.log("Saving final AGI state...");
    GB.saveModel(agi_core, "agi_brain.ckpt");
    break;
  }

  var task_difficulty = Math.min(10.0, (step / 100) + 1);
  var insight = GB.hive.trainTask(agi_core, { difficulty: task_difficulty });
  
  GB.ACHA.archive(coder, insight, "concept_" + step);
  
  var expanded = GB.hive.HiveMind.autoExpandIfReady(agi_core);
  if (expanded) {
    GB.Utils.log(\`>>> [Step \${step}] NEUROGENESIS EVENT: Brain Capacity Expanded +10%\`);
    iq += 2.5;
  }

  if (step % 500 === 0 && step > 0) {
     GB.Utils.log(\`>>> SYSTEM EVENT: Periodic memory consolidation.\`);
     var user_approved = GB.Control.requestConfirmation("Auto-save AGI Checkpoint?");
     if (user_approved) {
         GB.saveModel(agi_core, "agi_brain.ckpt");
         GB.Utils.log(\`>>> SUCCESS: Core state persisted.\`);
     } else {
         GB.Utils.log(\`>>> CANCELLED: Auto-save aborted.\`);
     }
  }

  iq += 0.01; 
  knowledge_breadth += 5;
  
  if (sig === "TRIGGER_ANOMALY") {
     GB.Utils.log(">>> ANOMALY: Logic Contradiction Detected.");
     iq -= 1.0;
  }
  
  if (step % 5 === 0) {
    GB.Utils.log(\`[AGI Step \${step}] IQ: \${iq.toFixed(1)} | Concepts: \${knowledge_breadth} | Status: EVOLVING\`);
  }

  GB.Visual.plot({
    title: "AGI Capability Index",
    xAxisKey: "step",
    type: "area",
    series: [
      { key: "iq", color: "#facc15", name: "Est. IQ" },
      { key: "concepts", color: "#3b82f6", name: "Knowledge Base (/10)" }
    ],
    data: [{
      step: step,
      iq: iq,
      concepts: knowledge_breadth / 10
    }]
  });

  step++;
  GB.Utils.sleep(20);
}
`;

export const OPTIMIZATION_CODE = `// GooberLang Project: "The Merger"
// Optimization HiveMind Swarm Controller

GB.Utils.log(">>> INITIALIZING GLOBAL OPTIMIZATION PROTOCOL...");
var agents = GB.hive.scanLocalAgents(); 

if (agents.length === 0) {
  GB.Utils.log(">>> WARNING: No other AI agents detected.");
} else {
  GB.Utils.log(\`>>> DETECTED \${agents.length} AI MODULES: \${agents.join(", ")}\`);
}

var hive = GB.hive.SuperCluster(agents);
GB.Utils.log(">>> ESTABLISHING NEURAL LINK... SYNCHRONIZATION STARTED.");

var step = 0;
var synergy = 0.0;
var total_compute = 0.0;

while(true) {
   if (GB.hive.isAlreadyRunning("optimization.gb")) {
      GB.Utils.log(">>> ABORT: Optimization protocol already active.");
      break;
   }

   var sig = GB.Control.getSignal();
   if (sig === "STOP") break;

   var optimization_gain = GB.hive.optimizeSwarm(hive);
   synergy += optimization_gain * (1.0 + (step/1000));
   total_compute += 10.5;

   if (step % 10 === 0) {
      GB.Utils.log(\`[Sync \${step}] Swarm Synergy: \${synergy.toFixed(1)}% | Nodes Active: \${agents.length}\`);
   }
   
   GB.Visual.plot({
      title: "HiveMind Swarm Efficiency",
      xAxisKey: "step",
      type: "area",
      series: [
         { key: "synergy", color: "#22d3ee", name: "Synergy" }, 
         { key: "compute", color: "#c084fc", name: "Total Compute" }
      ],
      data: [{
         step: step,
         synergy: synergy,
         compute: total_compute
      }]
   });

   step++;
   GB.Utils.sleep(10);
}
GB.Utils.log(">>> OPTIMIZATION PROTOCOL DISENGAGED.");
`;

export const MULTI_CODE = `// GooberLang Macro: Multi-Agent Setup
GB.Utils.log(">>> MACRO EXECUTED: 'multi.gb'");
GB.Utils.log(">>> INITIATING SWARM DEPLOYMENT...");
GB.Utils.log("... Creating AGI Core (agi.gb)");
GB.Utils.log("... Creating LLM Matrix (llm.gb)");
GB.Utils.log("... Creating Optimization Controller (optimization.gb)");
GB.Utils.log(">>> HANDOFF: Transferring control to Optimization Protocol.");
`;

export const GOD_MODE_CODE = `// GooberLang Project: "THE_ARCHITECT_OMNI"
// Class: Hyper-Intelligent Neuro-Symbolic AGI
// Strategy: Evolutionary Distillation & Symbolic Reasoning

GB.Utils.log(">>> INITIALIZING OMNI-ARCHITECT PROTOCOL...");

// 1. HYBRID CORE
var core = GB.hive.HiveMind("Omni_Core", {
  capacity: 50000,
  plasticity: 0.8,
  meta_learning: true
});

GB.Graph.createNode("SELF", { type: "AGI_ROOT", created: GB.Utils.timer() });

// Evolutionary Sub-Processors (The "Think Tank")
var population = GB.Evo.createPopulation(5, { in: 10, out: 4 });

var step = 0;
var iq = 160.0;
var mastery_level = 0;
var strategy = "EVOLVE"; // EVOLVE, DISTILL, EXPAND, OPTIMIZE

GB.Utils.log(">>> CORE ONLINE. THREADS ALLOCATED: 4");
GB.System.allocateThreads(4);

while(true) {
  var sig = GB.Control.getSignal();
  if (sig === "STOP") break;

  // --- PHASE 1: CHALLENGE GENERATION ---
  var challenge = GB.World.generateData(mastery_level);
  
  // --- PHASE 2: ADAPTIVE EVOLUTION ---
  var mutation_rate = Math.max(0.02, 0.3 - (mastery_level * 0.0015));
  for (var i = 0; i < population.length; i++) {
      GB.Evo.mutate(population[i], mutation_rate); 
  }
  
  var best_agent_idx = -1;
  var best_acc = 0.0;
  for (var i = 0; i < population.length; i++) {
      var pred = population[i].forward(challenge.input);
      var loss = 0;
      for(var j=0; j<pred.length; j++) loss += Math.pow(pred[j] - challenge.target[j], 2);
      var mse = loss / pred.length;
      var acc = Math.max(0, 1.0 - mse); 
      if (acc > best_acc) { best_acc = acc; best_agent_idx = i; }
  }
  
  // --- PHASE 3: KNOWLEDGE DISTILLATION ---
  if (best_acc > 0.88) {
      GB.Utils.log(\`>>> [INSIGHT] Agent_\${best_agent_idx} solved Level \${mastery_level} (Acc: \${(best_acc*100).toFixed(1)}%)\`);
      GB.Quant.distill(population[best_agent_idx], core);
      var concept_id = "Concept_" + mastery_level;
      GB.Graph.createNode(concept_id, { difficulty: mastery_level });
      GB.Graph.link("SELF", concept_id, "mastered");
      mastery_level++;
      strategy = "DISTILL";
      GB.Utils.log(\`>>> [MASTERY] Level \${mastery_level-1} Conquered. Knowledge Graph Updated.\`);
      var winner = population[best_agent_idx];
      population = GB.Evo.createPopulation(5, { in: 10, out: 4 });
      population[0] = winner;
  } else {
      GB.hive.trainTask(core, { difficulty: mastery_level });
      strategy = "GRIND";
      if (step % 50 === 0 && best_acc < 0.3) {
          GB.Utils.log(">>> [WARN] Evolutionary Stagnation. Flushing gene pool.");
          population = GB.Evo.createPopulation(5, { in: 10, out: 4 });
      }
  }

  // --- PHASE 4: SMART SCALING ---
  if (best_acc < 0.5 && step % 60 === 0) {
      if (iq < 300) {
          if (GB.hive.HiveMind.autoExpandIfReady(core)) {
              GB.Utils.log(">>> [SINGULARITY] NEUROGENESIS EVENT. Core Architecture Expanded.");
              iq += 12.5;
          }
      } else {
          GB.Utils.log(">>> [OPTIMIZE] Max Capacity. Engaging Deep Optimization.");
          GB.Evo.mutate(core, 0.05);
          GB.System.overclock(core);
          strategy = "OPTIMIZE";
      }
      GB.System.clearVRAM(); 
  }

  // --- PHASE 5: SELF-MODIFICATION (Train on GB) ---
  if (strategy === "OPTIMIZE" && step % 100 === 0) {
      GB.Utils.log(">>> [META] Architect attempting Self-Modification...");
      var editSuccess = GB.Code.selfEdit("plasticity: 0.8", "plasticity: 0.95");
      if (editSuccess) {
          GB.Utils.log(">>> [META] Source Code Re-written. Parameter injection successful.");
      } else {
          GB.Code.rollback();
      }
  }

  if (step % 10 === 0) {
      GB.Utils.log(\`[Cycle \${step}] IQ: \${iq.toFixed(0)} | Lvl: \${mastery_level} | BestHypothesis: \${(best_acc*100).toFixed(1)}% | Mode: \${strategy}\`);
  }

  GB.Visual.plot({
    title: "Omni-Architect Metrics",
    xAxisKey: "step",
    type: "area",
    series: [
      { key: "hypothesis", color: "#22d3ee", name: "Hypothesis Acc" },
      { key: "iq", color: "#facc15", name: "System IQ" },
      { key: "mastery", color: "#a855f7", name: "Domain Level" }
    ],
    data: [{
      step: step,
      hypothesis: best_acc,
      iq: iq / 3,
      mastery: mastery_level / 10
    }]
  });

  step++;
  GB.Utils.sleep(20);
}
`;

export const OMEGA_CODE = `// GooberLang Project: OMEGA POINT
// Strategy: Dynamic Architectural Search

GB.Utils.log(">>> INITIALIZING OMEGA POINT PROTOCOL...");
var brain = GB.hive.HiveMind("Omega_Core", { capacity: 25000, plasticity: 0.5, layers: 6 });
var coder = GB.ACHA.createCoder({ latent_dim: 512 });
var step = 0;
var complexity = 6.0;
var entropy = 1.0;
var plateau_counter = 0;

GB.Utils.log(">>> CORE STABLE. SEARCHING FOR OPTIMAL TOPOLOGY...");

while(true) {
   var sig = GB.Control.getSignal();
   if (sig === "STOP") break;
   
   var result = GB.hive.trainTask(brain, {});
   entropy = result.loss;
   
   if (entropy > 0.15) { plateau_counter++; } else { plateau_counter = 0; }
   
   if (plateau_counter > 50 || GB.hive.HiveMind.autoExpandIfReady(brain)) {
      GB.Utils.log(\`>>> [OMEGA EVENT] Structural Mutation Detected. Injecting Layer...\`);
      complexity += 1.0; 
      plateau_counter = 0;
   }
   
   if (step % 50 === 0) {
      var spar = GB.ACHA.spar(coder, brain, { intensity: 0.5 });
      if (spar.retention < 0.95) {
         GB.Utils.log(">>> Memory Consolidation required. Retraining...");
         brain.plasticity = 0.8;
      }
   }

   if (step % 20 === 0) {
      GB.Utils.log(\`[Epoch \${step}] Entropy: \${entropy.toFixed(4)} | Depth: \${complexity.toFixed(0)} layers\`);
   }

   GB.Visual.plot({
      title: "Omega Point Convergence",
      xAxisKey: "step",
      type: "area",
      series: [
         { key: "complexity", color: "#8b5cf6", name: "Neural Depth" },
         { key: "entropy", color: "#f43f5e", name: "System Entropy" }
      ],
      data: [{
         step: step,
         complexity: complexity,
         entropy: entropy * 10
      }]
   });

   step++;
   GB.Utils.sleep(20);
}
`;

export const EASTER_EGGS: EasterEgg[] = [
  {
    filename: "agi.gb",
    description: "A self-improving AGI that uses ACHA to prevent catastrophic forgetting.",
    trigger: "Create a file named 'agi.gb'."
  },
  {
    filename: "llm.gb",
    description: "An interactive Large Language Model trainer.",
    trigger: "Create a file named 'llm.gb'."
  },
  {
    filename: "optimization.gb",
    description: "Connects all other 'AI' class files in the workspace into a SuperCluster.",
    trigger: "Create a file named 'optimization.gb'."
  },
  {
    filename: "multi.gb",
    description: "A macro that instantly generates the entire AI suite.",
    trigger: "Create a file named 'multi.gb'."
  },
  {
    filename: "god_mode.gb",
    description: "The Architect Omni. A powerful Neuro-Symbolic AGI with self-editing code, evolutionary sub-agents, and knowledge graph logic.",
    trigger: "Create a file named 'god_mode.gb' or 'god.gb'."
  },
  {
    filename: "omega.gb",
    description: "The Omega Point. Features active structural mutation.",
    trigger: "Create a file named 'omega.gb'."
  }
];

export const DOCS: DocItem[] = [
  {
    category: "Tensor & Data",
    items: [
      { name: "GB.Tensor", signature: "(shape, dtype)", desc: "Creates a new uninitialized tensor." },
      { name: "GB.zeros", signature: "(shape)", desc: "Creates a tensor filled with zeros." },
      { name: "GB.Data.batch", signature: "(dataset, size)", desc: "Creates a batch generator." },
      { name: "GB.TensorOps.mean", signature: "(tensor)", desc: "Calculates mean of tensor." },
      { name: "GB.TensorOps.concat", signature: "(tensors, axis)", desc: "Concatenates tensors." },
    ]
  },
  {
    category: "Math",
    items: [
      { name: "GB.Math.matmul", signature: "(a, b)", desc: "Performs matrix multiplication." },
      { name: "GB.Math.dot", signature: "(a, b)", desc: "Calculates dot product of two tensors." },
      { name: "GB.Math.softmax", signature: "(tensor)", desc: "Applies softmax activation." },
      { name: "GB.Math.cosineSim", signature: "(a, b)", desc: "Computes cosine similarity." },
    ]
  },
  {
    category: "Modeling",
    items: [
      { name: "GB.Modules.MLP", signature: "(config)", desc: "Multi-layer perceptron builder." },
      { name: "GB.Modules.Transformer", signature: "(heads, layers)", desc: "Standard transformer block." },
      { name: "GB.Modules.CNN", signature: "(config)", desc: "Convolutional Neural Network." },
      { name: "GB.Modules.WorldModel", signature: "(config)", desc: "Abstract model of environment dynamics." },
      { name: "GB.Loss.CrossEntropy", signature: "()", desc: "Standard classification loss." },
    ]
  },
  {
    category: "HiveMind & ACHA",
    items: [
      { name: "GB.hive.HiveMind", signature: "(name)", desc: "Instantiates an adaptive brain core." },
      { name: "GB.ACHA.createCoder", signature: "()", desc: "Spawns a code-generating agent." },
      { name: "GB.ACHA.archive", signature: "(coder, model, label)", desc: "Compresses task knowledge." },
      { name: "GB.ACHA.spar", signature: "(coder, model, config)", desc: "Active sparring against forgotten concepts." },
      { name: "GB.hive.trainTask", signature: "(mind, model, x, y)", desc: "Executes a training step." },
      { name: "GB.hive.HiveMind.autoExpandIfReady", signature: "(mind)", desc: "Triggers architectural growth." },
      { name: "GB.hive.SuperCluster", signature: "(agents)", desc: "Merges multiple HiveMinds into a swarm." },
    ]
  },
  {
    category: "Cognition & World",
    items: [
      { name: "GB.World.createEnvironment", signature: "(config)", desc: "Standard interface for any simulated environment." },
      { name: "GB.World.observe", signature: "(mind, env)", desc: "Feeds structured sensory data to a mind." },
      { name: "GB.World.act", signature: "(mind, env)", desc: "Lets the mind take actions that affect the world." },
      { name: "GB.World.generateData", signature: "(difficulty)", desc: "Generates raw input/target pairs for validation." },
      { name: "GB.Models.WorldModel", signature: "(config)", desc: "A trainable abstract model of how the environment behaves." }
    ]
  },
  {
    category: "Knowledge Graph",
    items: [
      { name: "GB.Graph.createNode", signature: "(id, data)", desc: "Adds a semantic node to the knowledge graph." },
      { name: "GB.Graph.link", signature: "(from, to, relation)", desc: "Creates a semantic relationship edge." },
      { name: "GB.Graph.query", signature: "(start, relation)", desc: "Retrieves connected nodes." },
      { name: "GB.Graph.findPath", signature: "(start, end)", desc: "Finds reasoning path between concepts." },
    ]
  },
  {
    category: "Evolutionary",
    items: [
      { name: "GB.Evo.createPopulation", signature: "(size, config)", desc: "Spawns a generation of agents." },
      { name: "GB.Evo.mutate", signature: "(agent, rate)", desc: "Applies random mutations to weights/topology." },
      { name: "GB.Evo.crossover", signature: "(parentA, parentB)", desc: "Combines two agents into offspring." },
      { name: "GB.Evo.speciate", signature: "(pop)", desc: "Groups agents by topological similarity." },
    ]
  },
  {
    category: "Reinforcement Learning",
    items: [
      { name: "GB.RL.computeAdvantage", signature: "(rewards, values)", desc: "Calculates GAE (Generalized Advantage Estimation)." },
      { name: "GB.RL.sampleAction", signature: "(probs)", desc: "Samples action from policy distribution." },
      { name: "GB.RL.updatePolicy", signature: "(agent, adv)", desc: "Optimizes agent based on advantage." },
    ]
  },
  {
    category: "Quantization",
    items: [
      { name: "GB.Quant.quantize", signature: "(model, bits)", desc: "Compresses model weights (e.g. 8-bit)." },
      { name: "GB.Quant.distill", signature: "(teacher, student)", desc: "Transfers knowledge from large to small model." },
    ]
  },
  {
    category: "System",
    items: [
      { name: "GB.System.allocateThreads", signature: "(count)", desc: "Manages parallel compute resources." },
      { name: "GB.System.clearVRAM", signature: "()", desc: "Forces garbage collection of unused tensors." },
      { name: "GB.System.overclock", signature: "(mind)", desc: "Boosts plasticity at cost of stability." },
    ]
  },
  {
    category: "WebGPU",
    items: [
      { name: "GB.GPU.init", signature: "()", desc: "Initializes the WebGPU device/adapter." },
      { name: "GB.GPU.dispatch", signature: "(shader, tensor)", desc: "Runs a WGSL compute shader on a tensor." },
    ]
  },
  {
    category: "Goals & Rewards",
    items: [
      { name: "GB.Goals.setGoal", signature: "(mind, spec)", desc: "Defines a goal (reward conditions, constraints)." },
      { name: "GB.Goals.reward", signature: "(mind, value)", desc: "Reinforcement signal without hard‑coding RL." },
      { name: "GB.Goals.generateSubgoals", signature: "(mind)", desc: "Creates automatic intermediate goals." },
      { name: "GB.Goals.selfEvaluate", signature: "(mind)", desc: "AI scores its own performance and learns cost functions." }
    ]
  },
  {
    category: "Memory & Context",
    items: [
      { name: "GB.Memory.longTermStore", signature: "(mind, key, value)", desc: "Explicit long‑term memory API." },
      { name: "GB.Memory.retrieve", signature: "(mind, query)", desc: "Queryable recall from LTM." },
      { name: "GB.Memory.forget", signature: "(mind, strategy)", desc: "Controlled forgetting. Use 'prune' to remove weak weights." }
    ]
  },
  {
    category: "Multi-Agent",
    items: [
      { name: "GB.Agents.communicate", signature: "(agentA, agentB, channel)", desc: "Agents exchange compressed thoughts." },
      { name: "GB.Agents.negotiate", signature: "(agents, task)", desc: "Group problem‑solving with shared credit." }
    ]
  },
  {
    category: "Self-Edit & Meta",
    items: [
      { name: "GB.Code.selfEdit", signature: "(target, replacement)", desc: "Modifies the running source code." },
      { name: "GB.Code.rollback", signature: "()", desc: "Reverts the last code modification." },
      { name: "GB.Meta.optimizeObjective", signature: "(mind)", desc: "AI changes its OWN loss/learning goals." }
    ]
  },
  {
    category: "FileSystem",
    items: [
      { name: "GB.FileSystem.list", signature: "(path)", desc: "List files/folders in a directory." },
      { name: "GB.FileSystem.read", signature: "(path)", desc: "Read the content of a file." },
      { name: "GB.FileSystem.exists", signature: "(path)", desc: "Check if a file or directory exists." },
      { name: "GB.FileSystem.isDirectory", signature: "(path)", desc: "Check if a path points to a directory." },
    ]
  },
  {
    category: "Control & Runtime",
    items: [
       { name: "GB.Control.getSignal", signature: "()", desc: "Reads the current signal from the UI Control Panel." },
       { name: "GB.Control.requestConfirmation", signature: "(message)", desc: "Pauses execution and requests user approval via a dialog." },
       { name: "GB.train", signature: "(model, data)", desc: "Standard training loop." },
       { name: "GB.evaluate", signature: "(model, data)", desc: "Evaluates model performance." },
    ]
  },
  {
    category: "Visualization",
    items: [
      { name: "GB.Visual.plot", signature: "(config)", desc: "Plots data to the IDE console." },
      { name: "GB.Visual.heatmap", signature: "(tensor)", desc: "Renders a 2D tensor heatmap." },
      { name: "GB.Visual.plotWeights", signature: "(model)", desc: "Visualizes layer weights." },
    ]
  },
];

export const COURSE_CURRICULUM: Lesson[] = [
  {
    id: "lesson-1",
    title: "Lesson 1: Tensor Basics",
    description: "In GooberLang, everything starts with Tensors. Let's initialize a zero-filled tensor to hold our data.",
    task: "Create a variable named 'data' and assign it a 10x10 zero tensor using GB.zeros.",
    hint: "Use GB.zeros([10, 10]).",
    validationRegex: [/var\s+data\s*=\s*GB\.zeros\(\s*\[\s*10\s*,\s*10\s*\]\s*\)/],
    startCode: "// Lesson 1: Initialize your first tensor\n"
  },
  {
    id: "lesson-2",
    title: "Lesson 2: The Neuron",
    description: "Now let's build a brain. We need a Linear layer that transforms inputs.",
    task: "Create a variable 'layer' using GB.Modules.Linear with 128 inputs and 64 outputs.",
    hint: "GB.Modules.Linear({ in: 128, out: 64 })",
    validationRegex: [/var\s+layer\s*=\s*GB\.Modules\.Linear\(\s*\{\s*(in:\s*128|out:\s*64),\s*(out:\s*64|in:\s*128)\s*\}\s*\)/],
    startCode: "// Lesson 2: Define a Linear Layer\n"
  },
  {
    id: "lesson-3",
    title: "Lesson 3: HiveMind Genesis",
    description: "Individual layers are weak. We need a HiveMind—a brain that manages itself.",
    task: "Initialize a HiveMind named 'BabyBrain'.",
    hint: "var mind = GB.hive.HiveMind(\"BabyBrain\")",
    validationRegex: [/var\s+\w+\s*=\s*GB\.hive\.HiveMind\(\s*["']BabyBrain["']\s*\)/],
    startCode: "// Lesson 3: Birth a HiveMind\n"
  },
  {
    id: "lesson-4",
    title: "Lesson 4: The Loop",
    description: "Intelligence requires iteration. Write a loop that runs 10 times and logs 'Training...'.",
    task: "Create a for loop or while loop that runs 10 times. Inside, use GB.Utils.log.",
    hint: "for(var i=0; i<10; i++) { ... }",
    validationRegex: [/(for\s*\(.*;.*;.*\)|while\s*\(.*\))/, /GB\.Utils\.log\(.*\)/],
    startCode: "// Lesson 4: The Training Loop\n"
  },
  {
    id: "lesson-5",
    title: "Lesson 5: Continual Learning (ACHA)",
    description: "Prevent catastrophic forgetting using an ACHA Coder.",
    task: "Initialize a coder using GB.ACHA.createCoder().",
    hint: "GB.ACHA.createCoder({})",
    validationRegex: [/GB\.ACHA\.createCoder\(/],
    startCode: "// Lesson 5: Initialize ACHA\n"
  },
  {
    id: "lesson-6",
    title: "Lesson 6: Symbolic Reasoning (Knowledge Graphs)",
    description: "Neuro-Symbolic AI combines neural nets with structured knowledge.",
    task: "Create a node in the graph with ID 'concept_1' and some data.",
    hint: "GB.Graph.createNode('concept_1', { type: 'idea' })",
    validationRegex: [/GB\.Graph\.createNode\(\s*['"]concept_1['"]\s*,\s*\{.*\}\s*\)/],
    startCode: "// Lesson 6: Create a Knowledge Graph Node\n"
  },
  {
    id: "lesson-7",
    title: "Lesson 7: Evolutionary Algorithms",
    description: "Evolution is a powerful optimizer. Spawn a population of neural agents.",
    task: "Create a population of 10 agents using GB.Evo.createPopulation.",
    hint: "GB.Evo.createPopulation(10, { in: 10, out: 4 })",
    validationRegex: [/GB\.Evo\.createPopulation\(\s*10\s*,\s*\{.*\}\s*\)/],
    startCode: "// Lesson 7: Spawn a Population\n"
  },
  {
    id: "lesson-8",
    title: "Lesson 8: Hardware Acceleration (WebGPU)",
    description: "For massive scale, we need the GPU. Initialize the WebGPU subsystem.",
    task: "Call GB.GPU.init() to request adapter access.",
    hint: "GB.GPU.init()",
    validationRegex: [/GB\.GPU\.init\(\)/],
    startCode: "// Lesson 8: Initialize WebGPU\n"
  },
  {
    id: "lesson-9",
    title: "Lesson 9: World Modeling",
    description: "AGI needs to understand its environment. Create a simulated World.",
    task: "Create an environment with difficulty level 1.",
    hint: "GB.World.createEnvironment({ difficulty: 1 })",
    validationRegex: [/GB\.World\.createEnvironment\(\s*\{\s*difficulty:\s*1\s*\}\s*\)/],
    startCode: "// Lesson 9: Create a World\n"
  },
  {
    id: "lesson-10",
    title: "Lesson 10: Self-Modification",
    description: "The ultimate power: Code that rewrites itself.",
    task: "Call GB.Code.selfEdit to change 'var x = 1' to 'var x = 2'.",
    hint: "GB.Code.selfEdit('x = 1', 'x = 2')",
    validationRegex: [/GB\.Code\.selfEdit\(\s*['"].*['"]\s*,\s*['"].*['"]\s*\)/],
    startCode: "// Lesson 10: Self-Editing Code\nvar x = 1;\n"
  }
];

export const AUTOCOMPLETE_TOKENS = [
  "GB.Tensor", "GB.zeros", "GB.rand", "GB.Variable", 
  "GB.TensorOps.mean", "GB.TensorOps.std", "GB.TensorOps.normalize", "GB.TensorOps.concat", "GB.TensorOps.argmax",
  "GB.Data.TensorDataset", "GB.Data.shuffle", "GB.Data.batch",
  "GB.Modules.Linear", "GB.Modules.MLP", "GB.Modules.CNN", "GB.Modules.Transformer", "GB.Modules.ResidualBlock", "GB.Modules.WorldModel",
  "GB.Loss.MSE", "GB.Loss.CrossEntropy",
  "GB.Optim.SGD", "GB.Optim.Adam", "GB.Optim.RMSProp",
  "GB.ACHA.createCoder", "GB.ACHA.archive", "GB.ACHA.spar",
  "GB.hive.HiveMind", "GB.hive.trainTask", "GB.hive.HiveMind.autoExpandIfReady", "GB.hive.SuperCluster",
  "GB.World.createEnvironment", "GB.World.observe", "GB.World.act", "GB.World.generateData", "GB.Models.WorldModel",
  "GB.Goals.setGoal", "GB.Goals.reward", "GB.Goals.generateSubgoals", "GB.Goals.selfEvaluate",
  "GB.Memory.longTermStore", "GB.Memory.retrieve", "GB.Memory.forget",
  "GB.Agents.communicate", "GB.Agents.negotiate", "GB.Meta.optimizeObjective",
  "GB.Graph.createNode", "GB.Graph.link", "GB.Graph.query", "GB.Graph.findPath",
  "GB.Evo.createPopulation", "GB.Evo.mutate", "GB.Evo.crossover", "GB.Evo.speciate",
  "GB.RL.computeAdvantage", "GB.RL.sampleAction", "GB.RL.updatePolicy",
  "GB.Quant.quantize", "GB.Quant.distill",
  "GB.System.allocateThreads", "GB.System.clearVRAM", "GB.System.overclock",
  "GB.Code.selfEdit", "GB.Code.rollback",
  "GB.Math.matmul", "GB.Math.dot", "GB.Math.softmax", "GB.Math.cosineSim",
  "GB.FileSystem.list", "GB.FileSystem.read", "GB.FileSystem.exists", "GB.FileSystem.isDirectory",
  "GB.GPU.init", "GB.GPU.dispatch",
  "GB.Visual.plot", "GB.Visual.heatmap", "GB.Visual.plotWeights",
  "GB.Utils.timer", "GB.Utils.sleep", "GB.Utils.memUsage", "GB.Utils.log",
  "GB.RandomOps.normal", "GB.RandomOps.perturb", "GB.RandomOps.sample",
  "GB.AutoDiff.grad", "GB.train", "GB.evaluate", "GB.saveModel", "GB.loadModel",
  "GB.Control.getSignal", "GB.Control.requestConfirmation", "var", "while", "if", "else", "for", "function", "return", "true", "false"
];