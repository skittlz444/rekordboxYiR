import { StatsResponse } from '@/shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Button } from '@/client/components/ui/button'
import { Play, Music, Disc, Users, Calendar, TrendingUp } from 'lucide-react'

interface DashboardProps {
  data: StatsResponse
  onPlayStory: () => void
}

export function Dashboard({ data, onPlayStory }: DashboardProps) {
  const { stats, year, comparison } = data

  // Calculate some summary stats
  const topArtist = stats.topArtists[0]?.Name || 'Unknown'
  const topTrack = stats.topTracks[0]
  const topGenre = stats.topGenres[0]?.Name || 'Unknown'
  const totalHours = Math.round(stats.totalPlaytimeSeconds / 3600)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Your {year} Year in Review</h1>
        <p className="text-muted-foreground">
          Here&apos;s a summary of your DJ stats for {year}
          {comparison && ` (compared to ${comparison.year})`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Plays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Total Plays
            </CardTitle>
            <CardDescription>Tracks played in {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTracks.toLocaleString()}</div>
            {comparison && comparison.diffs.tracksPercentage > 0 && (
              <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                +{comparison.diffs.tracksPercentage}% from {comparison.year}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Playtime */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Total Playtime
            </CardTitle>
            <CardDescription>Hours on the decks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHours}h</div>
            {comparison && comparison.diffs.playtimePercentage > 0 && (
              <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                +{comparison.diffs.playtimePercentage}% from {comparison.year}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sets Played */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Disc className="w-5 h-5" />
              Sets Played
            </CardTitle>
            <CardDescription>DJ sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
            {comparison && comparison.diffs.totalSessionsPercentage > 0 && (
              <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                +{comparison.diffs.totalSessionsPercentage}% from {comparison.year}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Artist */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Artist
            </CardTitle>
            <CardDescription>Your most played artist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{topArtist}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.topArtists[0]?.count || 0} plays
            </div>
          </CardContent>
        </Card>

        {/* Top Track */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Top Track
            </CardTitle>
            <CardDescription>Your most played track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {topTrack?.Title || 'Unknown'}
            </div>
            <div className="text-sm text-muted-foreground truncate mt-1">
              {topTrack?.Artist || 'Unknown'} • {topTrack?.count || 0} plays
            </div>
          </CardContent>
        </Card>

        {/* Top Genre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Disc className="w-5 h-5" />
              Top Genre
            </CardTitle>
            <CardDescription>Your favorite genre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{topGenre}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.topGenres[0]?.count || 0} plays
            </div>
          </CardContent>
        </Card>

        {/* Library Growth */}
        {stats.libraryGrowth && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Library Growth</CardTitle>
              <CardDescription>Your collection in {year}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats.libraryGrowth.added > 0 ? '+' : ''}
                    {stats.libraryGrowth.added.toLocaleString()} tracks
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total library: {stats.libraryGrowth.total.toLocaleString()} tracks
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Play Story CTA */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold mb-2">Ready for the full experience?</h2>
            <p className="mb-6 opacity-90">
              View your year in review as an interactive story
            </p>
            <Button
              size="lg"
              onClick={onPlayStory}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Story
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
