import { LogEntry, PlotData, RuntimeSignal, FileNode } from '../types';

type LogCallback = (entry: LogEntry) => void;
type PlotCallback = (data: PlotData) => void;
type ConfirmationCallback = (message: string) => Promise<boolean>;
type FileSystemAccessor = () => FileNode[];
type CodeUpdateCallback = (newCode: string) => void;

// --- Lightweight Deep Learning Engine (Real Math) ---

class SimpleTensor {
  data: Float32Array;
  shape: number[];

  constructor(shape: number[], init: 'zeros' | 'rand' | 'identity' = 'zeros') {
    this.shape = shape;
    const size = shape.reduce((a, b) => a * b, 1);
    this.data = new Float32Array(size);
    
    if (init === 'rand') {
      for (let i = 0; i < size; i++) {
        this.data[i] = (Math.random() * 2 - 1) * Math.sqrt(2 / (shape[0] || 1)); 
      }
    } else if (init === 'identity' && shape.length === 2 && shape[0] === shape[1]) {
      for (let i = 0; i < shape[0]; i++) {
        this.data[i * shape[0] + i] = 1.0;
      }
    }
  }
}

class DenseLayer {
  weights: SimpleTensor;
  bias: SimpleTensor;
  inSize: number;
  outSize: number;

  constructor(inSize: number, outSize: number, init: 'rand' | 'identity' = 'rand') {
    this.inSize = inSize;
    this.outSize = outSize;
    this.weights = new SimpleTensor([inSize, outSize], init);
    this.bias = new SimpleTensor([outSize], 'zeros');
  }

  forward(input: Float32Array): Float32Array {
    const output = new Float32Array(this.outSize);
    for (let o = 0; o < this.outSize; o++) {
      let sum = this.bias.data[o];
      for (let i = 0; i < this.inSize; i++) {
        sum += input[i] * this.weights.data[i * this.outSize + o];
      }
      output[o] = Math.tanh(sum); 
    }
    return output;
  }

  mutate(intensity: number): { wBackup: Float32Array, bBackup: Float32Array } {
    const wBackup = new Float32Array(this.weights.data);
    const bBackup = new Float32Array(this.bias.data);
    for(let i=0; i<this.weights.data.length; i++) {
      if (Math.random() < 0.2) this.weights.data[i] += (Math.random() - 0.5) * intensity;
    }
    for(let i=0; i<this.bias.data.length; i++) {
        if (Math.random() < 0.2) this.bias.data[i] += (Math.random() - 0.5) * intensity;
    }
    return { wBackup, bBackup };
  }

  revert(backup: { wBackup: Float32Array, bBackup: Float32Array }) {
    this.weights.data.set(backup.wBackup);
    this.bias.data.set(backup.bBackup);
  }

  prune(threshold: number) {
    let count = 0;
    for(let i=0; i<this.weights.data.length; i++) {
      if (Math.abs(this.weights.data[i]) < threshold) {
        this.weights.data[i] = 0;
        count++;
      }
    }
    return count;
  }
}

class RealNeuralNet {
  layers: DenseLayer[];
  name: string;
  ltm: Map<string, any> = new Map();
  currentGoal: any = null;
  satisfaction: number = 0.5;
  plasticity: number = 0.5;
  lastExpansion: number = 0;
  
  constructor(name: string, config: any) {
    this.name = name;
    const inputSize = config.in || 10;
    const outputSize = config.out || 4;
    const hiddenSize = config.hidden || 16;
    this.layers = [
      new DenseLayer(inputSize, hiddenSize),
      new DenseLayer(hiddenSize, outputSize) 
    ];
  }

  expand() {
    const prevOut = this.layers[this.layers.length - 2].outSize;
    const nextIn = this.layers[this.layers.length - 1].inSize;
    const initType = (prevOut === nextIn) ? 'identity' : 'rand';
    const newLayer = new DenseLayer(prevOut, nextIn, initType); 
    this.layers.splice(this.layers.length - 1, 0, newLayer);
    this.lastExpansion = Date.now();
  }
  
  pruneWeights(threshold: number) {
    let totalPruned = 0;
    this.layers.forEach(l => totalPruned += l.prune(threshold));
    return totalPruned;
  }

  forward(input: Float32Array): Float32Array {
    let x = input;
    for (const layer of this.layers) {
      x = layer.forward(x);
    }
    return x;
  }

  trainStep(input: Float32Array, target: Float32Array, learningRate: number): number {
    const predBefore = this.forward(input);
    let lossBefore = 0;
    for(let i=0; i<predBefore.length; i++) lossBefore += Math.pow(predBefore[i] - target[i], 2);

    const backups = this.layers.map(l => l.mutate(learningRate));

    const predAfter = this.forward(input);
    let lossAfter = 0;
    for(let i=0; i<predAfter.length; i++) lossAfter += Math.pow(predAfter[i] - target[i], 2);

    if (lossAfter > lossBefore) {
       this.layers.forEach((l, i) => l.revert(backups[i]));
       return lossBefore;
    }
    return lossAfter;
  }
}

class KnowledgeGraph {
    nodes: Map<string, any> = new Map();
    edges: { from: string, to: string, type: string, weight: number }[] = [];
    addNode(id: string, data: any) { this.nodes.set(id, data); }
    addEdge(from: string, to: string, type: string, weight: number = 1.0) { this.edges.push({ from, to, type, weight }); }
    query(startNode: string, relation: string): string[] { return this.edges.filter(e => e.from === startNode && e.type === relation).map(e => e.to); }
}

class TaskEngine {
    static generate(difficulty: number) {
        const input = new Float32Array(10).fill(0);
        const target = new Float32Array(4).fill(0);
        if (difficulty === 0) {
            for(let i=0; i<4; i++) { input[i] = Math.random() > 0.5 ? 1.0 : -1.0; target[i] = input[i]; }
        } else if (difficulty === 1) {
            for(let i=0; i<4; i++) { input[i] = Math.random() > 0.5 ? 1.0 : -1.0; target[i] = -input[i]; }
        } else if (difficulty === 2) {
             input[0] = Math.random() > 0.5 ? 1.0 : -1.0; input[1] = Math.random() > 0.5 ? 1.0 : -1.0;
             target[0] = (input[0] > 0 && input[1] > 0) ? 1.0 : -1.0; target[1] = (input[0] > 0 || input[1] > 0) ? 1.0 : -1.0;
        } else if (difficulty === 3) {
             input[0] = Math.random() > 0.5 ? 1.0 : -1.0; input[1] = Math.random() > 0.5 ? 1.0 : -1.0;
             target[0] = (input[0] !== input[1]) ? 1.0 : -1.0;
        } else {
             const phase = Math.random() * Math.PI * 2;
             input[0] = Math.sin(phase); input[1] = Math.cos(phase); target[0] = Math.sin(phase * 2); 
        }
        return { input, target };
    }
}

// --- Runtime Environment ---

export class GooberRuntime {
  private onLog: LogCallback;
  private onPlot: PlotCallback;
  private onConfirm: ConfirmationCallback;
  private onCodeUpdate?: CodeUpdateCallback;
  private fileSystemAccessor?: FileSystemAccessor;
  private signals: RuntimeSignal[] = [];
  private isRunning: boolean = false;
  private activeModels: Map<string, RealNeuralNet> = new Map();
  private knowledgeGraph = new KnowledgeGraph();
  private gpuDevice: any = null; 
  
  private codeHistory: string[] = [];
  private currentCode: string = "";

  constructor(
    onLog: LogCallback, 
    onPlot: PlotCallback, 
    onConfirm: ConfirmationCallback,
    fileSystemAccessor?: FileSystemAccessor,
    onCodeUpdate?: CodeUpdateCallback
  ) {
    this.onLog = onLog;
    this.onPlot = onPlot;
    this.onConfirm = onConfirm;
    this.fileSystemAccessor = fileSystemAccessor;
    this.onCodeUpdate = onCodeUpdate;
  }

  pushSignal(signal: RuntimeSignal) { this.signals.push(signal); }
  stop() { this.isRunning = false; }

  private resolvePath(path: string): FileNode | null {
      if (!this.fileSystemAccessor) return null;
      const files = this.fileSystemAccessor();
      if (path === '/' || path === '.' || path === '') return { id: 'ROOT', name: 'root', type: 'folder', parentId: null, content: '', depth: -1 };
      const parts = path.split('/').filter(p => p && p !== '.');
      let currentParentId: string | null = null;
      let targetNode: FileNode | undefined;
      for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          targetNode = files.find(f => f.parentId === currentParentId && f.name === part);
          if (!targetNode) return null;
          if (i < parts.length - 1) {
              if (targetNode.type !== 'folder') return null;
              currentParentId = targetNode.id;
          }
      }
      return targetNode || null;
  }

  async run(userCode: string) {
    this.isRunning = true;
    this.signals = [];
    this.activeModels.clear();
    this.currentCode = userCode;
    this.codeHistory = [];

    const createHiveMind = (name: string, config: any) => {
        const net = new RealNeuralNet(name, config);
        this.activeModels.set(name, net);
        (net as any).capacity = config.capacity || 10000;
        (net as any).plasticity = config.plasticity || 0.5;
        return net;
    };
    
    (createHiveMind as any).autoExpandIfReady = (mind: any) => {
         if (mind instanceof RealNeuralNet) {
            const now = Date.now();
            if (now - mind.lastExpansion > 5000) {
                if ((mind.satisfaction < 0.6 && mind.plasticity > 0.8) || Math.random() > 0.99) {
                    mind.expand();
                    return true;
                }
            }
         }
         return false;
    };

    const GB = {
      Tensor: (shape: number[]) => new SimpleTensor(shape),
      zeros: (shape: number[]) => new SimpleTensor(shape, 'zeros'),
      Modules: {
        Linear: (config: any) => new DenseLayer(config.in || 64, config.out || 64),
        MLP: (config: any) => new RealNeuralNet("MLP", config),
        Transformer: (config: any) => new RealNeuralNet("Transformer", config),
        CNN: (config: any) => new RealNeuralNet("CNN", config),
        WorldModel: (config: any) => new RealNeuralNet("WorldModel", config),
      },
      Models: { WorldModel: (config: any) => new RealNeuralNet("WorldModel", config) },
      World: {
          createEnvironment: (config: any) => ({ ...config, step: 0 }),
          generateData: (difficulty: number) => TaskEngine.generate(difficulty),
          observe: (mind: any, env: any) => TaskEngine.generate(env.difficulty || 0).input,
          act: (mind: any, env: any, action: any) => ({ reward: 0, done: false })
      },
      Goals: {
          setGoal: (mind: any, spec: any) => { if(mind instanceof RealNeuralNet) mind.currentGoal = spec; },
          reward: (mind: any, value: number) => { if(mind instanceof RealNeuralNet) mind.satisfaction = (mind.satisfaction * 0.95) + (value * 0.05); },
          generateSubgoals: (mind: any) => ["solve_task"],
          selfEvaluate: (mind: any) => mind.satisfaction
      },
      Memory: {
          longTermStore: (mind: any, key: string, value: any) => { if(mind instanceof RealNeuralNet) mind.ltm.set(key, value); },
          retrieve: (mind: any, query: string) => (mind instanceof RealNeuralNet ? mind.ltm.get(query) || null : null),
          forget: (mind: any, strategy: string) => { if(mind instanceof RealNeuralNet) return strategy === "prune" ? mind.pruneWeights(0.1) : mind.ltm.clear(); }
      },
      Code: {
          selfEdit: (target: string, replacement: string) => {
              this.codeHistory.push(this.currentCode);
              const newCode = this.currentCode.split(target).join(replacement);
              if (newCode === this.currentCode) {
                  this.onLog({ id: Date.now().toString(), type: 'error', timestamp: new Date().toLocaleTimeString(), message: `[SelfEdit] Failed: Target '${target}' not found.` });
                  return false;
              }
              this.currentCode = newCode;
              this.onLog({ id: Date.now().toString(), type: 'system', timestamp: new Date().toLocaleTimeString(), message: `[SelfEdit] Code Modified: '${target}' -> '${replacement}'` });
              if (this.onCodeUpdate) this.onCodeUpdate(newCode);
              try {
                  if (target.includes("plasticity") && replacement.includes("plasticity")) {
                      this.activeModels.forEach(model => {
                          const match = replacement.match(/[\d\.]+/);
                          if (match) {
                              model.plasticity = parseFloat(match[0]);
                              this.onLog({ id: Date.now().toString(), type: 'info', timestamp: new Date().toLocaleTimeString(), message: `[HotReload] Updated runtime plasticity to ${model.plasticity}` });
                          }
                      });
                  }
              } catch(e) {}
              return true;
          },
          rollback: () => {
              if (this.codeHistory.length === 0) return false;
              const prevCode = this.codeHistory.pop();
              if (prevCode) {
                  this.currentCode = prevCode;
                  if (this.onCodeUpdate) this.onCodeUpdate(prevCode);
                  this.onLog({ id: Date.now().toString(), type: 'system', timestamp: new Date().toLocaleTimeString(), message: `[Rollback] Reverted code.` });
                  return true;
              }
              return false;
          }
      },
      Agents: {
          communicate: () => {},
          negotiate: () => true
      },
      Meta: {
          optimizeObjective: (mind: any) => {
              if(mind instanceof RealNeuralNet) {
                  const targetP = Math.max(0.1, 1.0 - mind.satisfaction);
                  mind.plasticity = (mind.plasticity * 0.9) + (targetP * 0.1);
              }
          }
      },
      Graph: {
          createNode: (id: string, data: any) => this.knowledgeGraph.addNode(id, data),
          link: (from: string, to: string, relation: string) => this.knowledgeGraph.addEdge(from, to, relation),
          query: (start: string, relation: string) => this.knowledgeGraph.query(start, relation),
          findPath: () => []
      },
      Evo: {
          createPopulation: (size: number, config: any) => Array.from({length: size}, (_, i) => new RealNeuralNet(`Agent_${i}`, config)),
          mutate: (agent: any, rate: number) => { if (agent instanceof RealNeuralNet) agent.layers.forEach(l => l.mutate(rate)); },
          crossover: () => new RealNeuralNet("Offspring", { in: 10, out: 4 }),
          speciate: (pop: any[]) => [pop]
      },
      RL: {
          computeAdvantage: (rewards: number[], values: number[]) => rewards.map((r, i) => r - values[i]),
          sampleAction: (probs: Float32Array) => {
              let sum = 0, r = Math.random();
              for(let i=0; i<probs.length; i++) { sum += probs[i]; if (r <= sum) return i; }
              return 0;
          },
          updatePolicy: () => {}
      },
      Quant: {
          quantize: (model: any, bits: number) => this.onLog({ id: Date.now().toString(), type: 'info', timestamp: new Date().toLocaleTimeString(), message: `[Quant] Compressed model to ${bits}-bit precision.` }),
          distill: (teacher: any, student: any) => { if (teacher instanceof RealNeuralNet && student instanceof RealNeuralNet) { student.plasticity = Math.max(0.1, teacher.plasticity * 0.8); student.satisfaction = teacher.satisfaction; } }
      },
      System: {
          allocateThreads: () => {},
          clearVRAM: () => this.onLog({ id: Date.now().toString(), type: 'system', timestamp: new Date().toLocaleTimeString(), message: "VRAM Garbage Collection Triggered." }),
          overclock: (mind: any) => { if (mind instanceof RealNeuralNet) { mind.plasticity = 1.0; this.onLog({ id: Date.now().toString(), type: 'error', timestamp: new Date().toLocaleTimeString(), message: `[WARN] Overclocking ${mind.name}.` }); } }
      },
      GPU: {
          init: async () => {
              if (!(navigator as any).gpu) { this.onLog({ id: Date.now().toString(), type: 'error', timestamp: new Date().toLocaleTimeString(), message: "[WebGPU] Not supported." }); return false; }
              try {
                  const adapter = await (navigator as any).gpu.requestAdapter();
                  if (!adapter) return false;
                  this.gpuDevice = await adapter.requestDevice();
                  this.onLog({ id: Date.now().toString(), type: 'success', timestamp: new Date().toLocaleTimeString(), message: `[WebGPU] Enabled.` });
                  return true;
              } catch (e: any) { return false; }
          },
          dispatch: async (shader: string, tensor: any) => {
              if (!this.gpuDevice) throw new Error("GPU not initialized.");
              return true; // Simulation of dispatch for stability
          }
      },
      FileSystem: {
          list: (path: string) => {
              const node = this.resolvePath(path);
              if (!node) return [];
              const targetId = node.id === 'ROOT' ? null : node.id;
              if (node.id !== 'ROOT' && node.type !== 'folder') return [];
              return (this.fileSystemAccessor ? this.fileSystemAccessor() : []).filter(f => f.parentId === targetId).map(f => f.name);
          },
          read: (path: string) => { const node = this.resolvePath(path); return (node && node.type === 'file') ? node.content : null; },
          exists: (path: string) => !!this.resolvePath(path),
          isDirectory: (path: string) => { const node = this.resolvePath(path); return node ? (node.type === 'folder' || node.id === 'ROOT') : false; }
      },
      hive: {
        HiveMind: createHiveMind, 
        trainTask: (mind: any, taskConfig: any) => {
           const net = mind as RealNeuralNet;
           let input, target;
           if (taskConfig.input && taskConfig.input.data) {
               input = taskConfig.input.data;
               if (!taskConfig.target && taskConfig.difficulty !== undefined) {
                   const t = TaskEngine.generate(taskConfig.difficulty); target = t.target;
               } else if (taskConfig.target) { target = taskConfig.target.data || taskConfig.target; } 
               else { target = new Float32Array(4).fill(0); }
           } else {
               const task = TaskEngine.generate(taskConfig.difficulty || 0);
               input = task.input; target = task.target;
           }
           const loss = net.trainStep(input, target, (mind as any).plasticity * 0.2);
           const mse = loss / net.layers[net.layers.length-1].outSize;
           const accuracy = Math.max(0, 1.0 - mse);
           net.satisfaction = (net.satisfaction * 0.9) + (accuracy * 0.1);
           return { loss: loss, accuracy: accuracy, insight_vector: new Float32Array(10).fill(0) };
        },
        scanLocalAgents: () => ["agi.gb", "llm.gb", "optimization.gb"],
        SuperCluster: (agents: any[]) => ({ name: "SuperCluster", agents }),
        optimizeSwarm: (hive: any) => 0.5 + Math.random() * 0.5,
        isAlreadyRunning: (filename: string) => false, 
      },
      ACHA: {
        createCoder: (config: any) => ({ ...config, memory: [] }),
        archive: (coder: any, data: any, label: string) => { coder.memory.push({ label, data }); },
        spar: (coder: any, model: any, config: any) => {
           const task = TaskEngine.generate(0);
           const pred = model.forward(task.input);
           let error = 0;
           for(let i=0; i<pred.length; i++) error += Math.pow(pred[i] - task.target[i], 2);
           const retention = Math.max(0, 1.0 - (error * 0.5)); 
           return { win_rate: retention > 0.8 ? 1.0 : 0.0, retention: retention };
        }
      },
      Utils: {
        log: (msg: string) => this.onLog({ id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), type: 'info', message: String(msg) }),
        sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
        timer: () => Date.now(),
      },
      Visual: {
        plot: (config: any) => this.onPlot({ id: config.title, title: config.title, xAxisKey: config.xAxisKey, type: config.type, series: config.series, data: config.data }),
        heatmap: () => {}, plotWeights: () => {}
      },
      Control: {
        getSignal: () => this.signals.shift() || null,
        requestConfirmation: async (msg: string) => await this.onConfirm(msg)
      },
      RandomOps: {
          normal: (mean: number, std: number) => { const u = 1 - Math.random(); const v = Math.random(); const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); return z * std + mean; },
          perturb: () => {}, sample: () => {}
      },
      AutoDiff: { grad: (fn: any) => 0.01 },
      train: (model: any, data: any) => {},
      evaluate: (model: any, data: any) => {},
      saveModel: (model: any, path: string) => { this.onLog({ id: Date.now().toString(), type: 'success', timestamp: new Date().toLocaleTimeString(), message: `Model ${model.name || 'Unknown'} saved to ${path}`}); },
      loadModel: (path: string) => null
    };

    let transpiled = userCode
       .replace(/while\s*\((.*?)\)\s*\{/g, 'while($1) { GB._checkStop(); await GB.Utils.sleep(30);')
       .replace(/for\s*\((.*?)\)\s*\{/g, 'for($1) { GB._checkStop(); await GB.Utils.sleep(30);');

    (GB as any)._checkStop = () => { if (!this.isRunning) throw new Error("STOP_EXECUTION"); };

    const executable = `(async () => { try { ${transpiled} } catch (e) { if (e.message === "STOP_EXECUTION") { GB.Utils.log("Execution stopped."); } else { GB.Utils.log("Runtime Error: " + e.message); console.error(e); } } finally { GB.Utils.log("Execution Finished."); } })()`;

    try { const runFn = new Function('GB', executable); await runFn(GB); } catch (e: any) { this.onLog({ id: 'err', timestamp: new Date().toLocaleTimeString(), type: 'error', message: `Compiler Error: ${e.message}` }); }
  }
}