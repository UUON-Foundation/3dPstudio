import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, FileJson, Box, Image, Loader2 } from 'lucide-react';
import { exportToGLTF, exportToUSD, exportCurveData, exportToSTL } from '../lib/utils/exportUtils';

export function ExportPanel() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: string, exportFn: () => Promise<void>) => {
    setExporting(type);
    try {
      await exportFn();
      console.log(`${type} export completed successfully`);
    } catch (error) {
      console.error(`${type} export failed:`, error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card className="absolute bottom-4 right-4 w-auto bg-black/90 border-green-500/30 text-white">
      <CardContent className="py-2 px-4">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => handleExport('GLB', () => exportToGLTF(true))}
            disabled={exporting !== null}
            size="sm"
            className="bg-green-600/80 hover:bg-green-600 text-white border-green-500/50 h-8 text-xs"
          >
            {exporting === 'GLB' ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-3 h-3 mr-1" />
                GLB
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('STL', exportToSTL)}
            disabled={exporting !== null}
            variant="outline"
            size="sm"
            className="border-orange-500/50 text-orange-300 hover:bg-orange-500/20 h-8 text-xs"
          >
            {exporting === 'STL' ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Box className="w-3 h-3 mr-1" />
                STL
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('USD', exportToUSD)}
            disabled={exporting !== null}
            variant="outline"
            size="sm"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 h-8 text-xs"
          >
            {exporting === 'USD' ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileJson className="w-3 h-3 mr-1" />
                USD
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('JSON', exportCurveData)}
            disabled={exporting !== null}
            variant="outline"
            size="sm"
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 h-8 text-xs"
          >
            {exporting === 'JSON' ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileJson className="w-3 h-3 mr-1" />
                JSON
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
