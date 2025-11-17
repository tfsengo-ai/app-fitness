"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, MapPin, Clock, Zap, Flame, Calendar, Users, User, Settings, Heart, MessageCircle, Bell, Plus, Search, Filter, Download, Image, Send, Star, ChevronRight, Check, Menu, X, Circle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState("running");
  const [isPremium, setIsPremium] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserEmail(session.user.email || "");
        setLoading(false);
      } else {
        router.push('/auth');
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth');
      } else {
        setUserEmail(session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              FitPro
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            {!isPremium && (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                onClick={() => setIsPremium(true)}
              >
                <Circle className="w-4 h-4 mr-2 fill-current" />
                Premium
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-red-400"
              onClick={handleSignOut}
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-5 bg-slate-900/50 border border-slate-800 p-1 rounded-2xl mb-6">
            <TabsTrigger 
              value="running" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl"
            >
              <Circle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Corrida</span>
            </TabsTrigger>
            <TabsTrigger 
              value="exercises"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl"
            >
              <Circle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Treinos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="nutrition"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-xl"
            >
              <Circle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nutrição</span>
            </TabsTrigger>
            <TabsTrigger 
              value="social"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-700 data-[state=active]:text-white rounded-xl"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA DE CORRIDA */}
          <TabsContent value="running" className="mt-0">
            <RunningTab isPremium={isPremium} />
          </TabsContent>

          {/* ABA DE EXERCÍCIOS */}
          <TabsContent value="exercises" className="mt-0">
            <ExercisesTab isPremium={isPremium} />
          </TabsContent>

          {/* ABA DE NUTRIÇÃO */}
          <TabsContent value="nutrition" className="mt-0">
            <NutritionTab isPremium={isPremium} />
          </TabsContent>

          {/* ABA SOCIAL */}
          <TabsContent value="social" className="mt-0">
            <SocialTab isPremium={isPremium} />
          </TabsContent>

          {/* ABA DE PERFIL */}
          <TabsContent value="profile" className="mt-0">
            <ProfileTab isPremium={isPremium} setIsPremium={setIsPremium} userEmail={userEmail} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// COMPONENTE: ABA DE CORRIDA
function RunningTab({ isPremium }: { isPremium: boolean }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [runHistory, setRunHistory] = useState([
    { id: 1, date: "2024-01-15", distance: 5.2, time: 1800, calories: 420 },
    { id: 2, date: "2024-01-13", distance: 3.8, time: 1320, calories: 310 },
    { id: 3, date: "2024-01-10", distance: 7.1, time: 2520, calories: 580 },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
        setDistance((prev) => prev + 0.002); // Simula movimento
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const avgSpeed = time > 0 ? (distance / (time / 3600)).toFixed(1) : "0.0";
  const pace = distance > 0 ? (time / 60 / distance).toFixed(2) : "0:00";
  const calories = Math.floor(distance * 65);

  const handleStartStop = () => {
    if (isRunning) {
      // Salvar corrida
      if (distance > 0.1) {
        const newRun = {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          distance: parseFloat(distance.toFixed(2)),
          time,
          calories,
        };
        setRunHistory([newRun, ...runHistory]);
      }
      setTime(0);
      setDistance(0);
    }
    setIsRunning(!isRunning);
  };

  const freeRunsUsed = runHistory.length;
  const freeRunsLimit = 5;
  const canStartRun = isPremium || freeRunsUsed < freeRunsLimit;

  return (
    <div className="space-y-6">
      {/* Mapa Simulado */}
      <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-emerald-500 animate-pulse" />
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-slate-300">
            <MapPin className="w-4 h-4 inline mr-1" />
            GPS Ativo
          </div>
        </div>
      </Card>

      {/* Estatísticas em Tempo Real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/20 p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Tempo</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatTime(time)}</p>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20 p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">Distância</span>
          </div>
          <p className="text-2xl font-bold text-white">{distance.toFixed(2)} km</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20 p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">Velocidade</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgSpeed} km/h</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20 p-4">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-medium">Calorias</span>
          </div>
          <p className="text-2xl font-bold text-white">{calories} kcal</p>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center gap-4">
        {!canStartRun && (
          <Card className="w-full bg-amber-500/10 border-amber-500/30 p-4">
            <p className="text-amber-400 text-center text-sm">
              Você atingiu o limite de {freeRunsLimit} corridas gratuitas. Assine o Premium para corridas ilimitadas!
            </p>
          </Card>
        )}
        
        <Button
          size="lg"
          disabled={!canStartRun && !isRunning}
          onClick={handleStartStop}
          className={`w-full max-w-md h-16 text-lg font-semibold rounded-2xl transition-all ${
            isRunning
              ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 mr-2" />
              Pausar Corrida
            </>
          ) : (
            <>
              <Play className="w-6 h-6 mr-2" />
              Iniciar Corrida
            </>
          )}
        </Button>

        {!isPremium && (
          <p className="text-slate-400 text-sm">
            Corridas usadas: {freeRunsUsed}/{freeRunsLimit}
          </p>
        )}
      </div>

      {/* Histórico */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Histórico de Corridas</h3>
          <Button variant="ghost" size="sm" className="text-emerald-400">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="space-y-3">
          {runHistory.map((run) => (
            <Card key={run.id} className="bg-slate-900/50 border-slate-800 p-4 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Circle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{run.distance} km</p>
                    <p className="text-sm text-slate-400">{run.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">{formatTime(run.time)}</p>
                  <p className="text-xs text-orange-400">{run.calories} kcal</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// COMPONENTE: ABA DE EXERCÍCIOS
function ExercisesTab({ isPremium }: { isPremium: boolean }) {
  const exercises = [
    { id: 1, name: "Flexões", category: "Força", duration: "3 min", calories: 45, premium: false },
    { id: 2, name: "HIIT Intenso", category: "Cardio", duration: "20 min", calories: 280, premium: true },
    { id: 3, name: "Abdominais", category: "Core", duration: "10 min", calories: 90, premium: false },
    { id: 4, name: "Alongamento", category: "Flexibilidade", duration: "15 min", calories: 50, premium: false },
    { id: 5, name: "Treino de Glúteos", category: "Força", duration: "25 min", calories: 200, premium: true },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Biblioteca de Exercícios</h2>
        <p className="text-slate-300">Escolha seu treino e comece agora!</p>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["Todos", "Força", "Cardio", "Core", "Flexibilidade"].map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-blue-500/20 hover:border-blue-500 whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {exercises.map((exercise) => (
          <Card
            key={exercise.id}
            className={`bg-slate-900/50 border-slate-800 p-5 hover:border-blue-500/30 transition-all ${
              exercise.premium && !isPremium ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white mb-1">{exercise.name}</h3>
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                  {exercise.category}
                </Badge>
              </div>
              {exercise.premium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  Premium
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exercise.duration}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                {exercise.calories} kcal
              </span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              disabled={exercise.premium && !isPremium}
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Treino
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// COMPONENTE: ABA DE NUTRIÇÃO
function NutritionTab({ isPremium }: { isPremium: boolean }) {
  const [photosTaken, setPhotosTaken] = useState(2);
  const dailyLimit = 3;

  const meals = [
    { id: 1, name: "Café da Manhã", time: "08:30", calories: 450, carbs: 60, protein: 20, fat: 15 },
    { id: 2, name: "Almoço", time: "12:45", calories: 680, carbs: 85, protein: 45, fat: 22 },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Diário Alimentar</h2>
        <p className="text-slate-300">Tire foto dos alimentos e registre automaticamente</p>
      </Card>

      {/* Resumo Diário */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h3 className="font-bold text-white mb-4">Resumo de Hoje</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-400">1130</p>
            <p className="text-xs text-slate-400">Calorias</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">145g</p>
            <p className="text-xs text-slate-400">Carboidratos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">65g</p>
            <p className="text-xs text-slate-400">Proteínas</p>
          </div>
        </div>
      </Card>

      {/* Botão de Foto */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        {!isPremium && photosTaken >= dailyLimit ? (
          <div className="text-center">
            <p className="text-amber-400 mb-4">Limite diário de fotos atingido!</p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              <Circle className="w-4 h-4 mr-2 fill-current" />
              Upgrade para Premium
            </Button>
          </div>
        ) : (
          <>
            <Button
              className="w-full h-32 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg font-semibold rounded-2xl"
              onClick={() => setPhotosTaken(photosTaken + 1)}
            >
              <Image className="w-8 h-8 mr-3" />
              Tirar Foto do Alimento
            </Button>
            {!isPremium && (
              <p className="text-center text-slate-400 text-sm mt-3">
                Fotos usadas hoje: {photosTaken}/{dailyLimit}
              </p>
            )}
          </>
        )}
      </Card>

      {/* Histórico de Refeições */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Refeições de Hoje</h3>
        <div className="space-y-3">
          {meals.map((meal) => (
            <Card key={meal.id} className="bg-slate-900/50 border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{meal.name}</h4>
                  <p className="text-sm text-slate-400">{meal.time}</p>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {meal.calories} kcal
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div>Carbs: {meal.carbs}g</div>
                <div>Proteína: {meal.protein}g</div>
                <div>Gordura: {meal.fat}g</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// COMPONENTE: ABA SOCIAL
function SocialTab({ isPremium }: { isPremium: boolean }) {
  const posts = [
    {
      id: 1,
      user: "Maria Silva",
      avatar: "MS",
      time: "2h atrás",
      content: "Acabei de completar 10km em 55 minutos! 🏃‍♀️💪",
      likes: 45,
      comments: 12,
      image: true,
    },
    {
      id: 2,
      user: "João Santos",
      avatar: "JS",
      time: "5h atrás",
      content: "Treino de pernas concluído! Quem mais treinou hoje?",
      likes: 32,
      comments: 8,
      image: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Social */}
      <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-pink-500/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Feed Social</h2>
            <p className="text-slate-300">Compartilhe sua jornada fitness</p>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Stories */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["Você", "Maria", "João", "Ana", "Pedro"].map((name, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 min-w-[70px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold">
                {name[0]}
              </div>
            </div>
            <span className="text-xs text-slate-400 truncate w-full text-center">{name}</span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-slate-900/50 border-slate-800 overflow-hidden">
            {/* Header do Post */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{post.user}</p>
                  <p className="text-xs text-slate-400">{post.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            {/* Conteúdo */}
            <div className="px-4 pb-3">
              <p className="text-slate-300">{post.content}</p>
            </div>

            {/* Imagem (se houver) */}
            {post.image && (
              <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <Image className="w-16 h-16 text-slate-600" />
              </div>
            )}

            {/* Ações */}
            <div className="p-4 flex items-center justify-between border-t border-slate-800">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-pink-400">
                <Heart className="w-5 h-5 mr-2" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400">
                <MessageCircle className="w-5 h-5 mr-2" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-emerald-400">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// COMPONENTE: ABA DE PERFIL
function ProfileTab({ isPremium, setIsPremium, userEmail }: { isPremium: boolean; setIsPremium: (value: boolean) => void; userEmail: string }) {
  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {userEmail[0].toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{userEmail}</h2>
          <p className="text-slate-400 mb-4">Membro desde Janeiro 2024</p>
          {isPremium ? (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <Circle className="w-3 h-3 mr-1 fill-current" />
              Premium Ativo
            </Badge>
          ) : (
            <Button
              onClick={() => setIsPremium(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Circle className="w-4 h-4 mr-2 fill-current" />
              Assinar Premium
            </Button>
          )}
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">24</p>
          <p className="text-xs text-slate-400">Corridas</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">156</p>
          <p className="text-xs text-slate-400">Treinos</p>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">12.5k</p>
          <p className="text-xs text-slate-400">Calorias</p>
        </Card>
      </div>

      {/* Conquistas */}
      <Card className="bg-slate-900/50 border-slate-800 p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Circle className="w-5 h-5 text-amber-400" />
          Conquistas Recentes
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center">
              <Star className="w-8 h-8 text-amber-400" />
            </div>
          ))}
        </div>
      </Card>

      {/* Configurações */}
      <div className="space-y-2">
        <h3 className="font-bold text-white mb-3">Configurações</h3>
        {[
          { icon: User, label: "Editar Perfil" },
          { icon: Bell, label: "Notificações" },
          { icon: Settings, label: "Preferências" },
          { icon: Circle, label: "Segurança e Privacidade" },
          { icon: Circle, label: "Idioma" },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-slate-900/50 border-slate-800 p-4 hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
