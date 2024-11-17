import { Dashboard } from "@/components/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiCoinMonitor } from "@/components/multi-coin-monitor";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 pt-6">
      <Tabs defaultValue="single" className="space-y-6">
        <div className="container mx-auto space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">
              Crypto Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Real-time cryptocurrency monitoring and analysis platform
            </p>
          </div>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="single">Single Asset Analysis</TabsTrigger>
            <TabsTrigger value="multi">Multi-Asset Monitor</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="single">
          <Dashboard />
        </TabsContent>
        <TabsContent value="multi">
          <MultiCoinMonitor />
        </TabsContent>
      </Tabs>
    </main>
  );
}