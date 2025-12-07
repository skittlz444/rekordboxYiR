import { StatsResponse } from '@/shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Button } from '@/client/components/ui/button'
import { Play, Music, Disc, Users, Calendar, TrendingUp, TrendingDown, Grid3x3 } from 'lucide-react'

interface DashboardProps {
  data: StatsResponse
  onPlayStory: () => void
  onViewAllSlides: () => void
}

export function Dashboard({ data, onPlayStory, onViewAllSlides }: DashboardProps) {
  const { stats, year, comparison } = data

  // Calculate some summary stats
  const totalHours = Math.round(stats.totalPlaytimeSeconds / 3600)
  const totalMinutes = Math.round(stats.totalPlaytimeSeconds / 60)
  const avgSessionLength = stats.totalSessions > 0 
    ? Math.round(stats.totalTracks / stats.totalSessions) 
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          size="lg"
          onClick={onPlayStory}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Play className="w-5 h-5 mr-2" />
          Play Story
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onViewAllSlides}
        >
          <Grid3x3 className="w-5 h-5 mr-2" />
          View All Slides
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Your {year} Year in Review</h1>
        <p className="text-muted-foreground">
          Detailed breakdown of your DJ stats for {year}
          {comparison && ` (compared to ${comparison.year})`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            {comparison && comparison.diffs.tracksPercentage !== 0 && (
              <div className={`text-sm flex items-center gap-1 mt-2 ${
                comparison.diffs.tracksPercentage > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.diffs.tracksPercentage > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    +{comparison.diffs.tracksPercentage}% from {comparison.year}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    {comparison.diffs.tracksPercentage}% from {comparison.year}
                  </>
                )}
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
            <CardDescription>Time on the decks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHours}h</div>
            <div className="text-sm text-muted-foreground mt-1">
              {totalMinutes.toLocaleString()} minutes
            </div>
            {comparison && comparison.diffs.playtimePercentage !== 0 && (
              <div className={`text-sm flex items-center gap-1 mt-2 ${
                comparison.diffs.playtimePercentage > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.diffs.playtimePercentage > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    +{comparison.diffs.playtimePercentage}% from {comparison.year}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    {comparison.diffs.playtimePercentage}% from {comparison.year}
                  </>
                )}
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
            <div className="text-sm text-muted-foreground mt-1">
              Avg {avgSessionLength} tracks/set
            </div>
            {comparison && comparison.diffs.totalSessionsPercentage !== 0 && (
              <div className={`text-sm flex items-center gap-1 mt-2 ${
                comparison.diffs.totalSessionsPercentage > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.diffs.totalSessionsPercentage > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    +{comparison.diffs.totalSessionsPercentage}% from {comparison.year}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    {comparison.diffs.totalSessionsPercentage}% from {comparison.year}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Longest Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Longest Session
            </CardTitle>
            <CardDescription>Your marathon set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.longestSession.count}</div>
            <div className="text-sm text-muted-foreground mt-1">
              tracks played
            </div>
            {stats.longestSession.durationSeconds && (
              <div className="text-sm text-muted-foreground mt-1">
                {Math.round(stats.longestSession.durationSeconds / 3600)}h {Math.round((stats.longestSession.durationSeconds % 3600) / 60)}m
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Artists */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Top 10 Artists
          </CardTitle>
          <CardDescription>Your most played artists of {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topArtists.slice(0, 10).map((artist, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{artist.Name}</div>
                  </div>
                </div>
                <div className="text-muted-foreground font-mono">
                  {artist.count.toLocaleString()} plays
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Tracks */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-6 h-6" />
            Top 10 Tracks
          </CardTitle>
          <CardDescription>Your most played tracks of {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topTracks.slice(0, 10).map((track, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{track.Title}</div>
                    <div className="text-sm text-muted-foreground truncate">{track.Artist}</div>
                  </div>
                </div>
                <div className="text-muted-foreground font-mono ml-4">
                  {track.count.toLocaleString()} plays
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Genres */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Disc className="w-6 h-6" />
            Top 10 Genres
          </CardTitle>
          <CardDescription>Your favorite genres of {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topGenres.slice(0, 10).map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{genre.Name}</div>
                  </div>
                </div>
                <div className="text-muted-foreground font-mono">
                  {genre.count.toLocaleString()} plays
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Session Statistics</CardTitle>
          <CardDescription>Breakdown of your DJ sessions in {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Busiest Month</div>
              <div className="text-2xl font-bold">
                {new Date(stats.busiestMonth.month + '-01').toLocaleDateString('en-US', { month: 'long' })}
              </div>
              <div className="text-sm text-muted-foreground">{stats.busiestMonth.count} tracks</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Longest Session Date</div>
              <div className="text-2xl font-bold">
                {new Date(stats.longestSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm text-muted-foreground">{stats.longestSession.count} tracks</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Average Session</div>
              <div className="text-2xl font-bold">{avgSessionLength}</div>
              <div className="text-sm text-muted-foreground">tracks per session</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Library Growth */}
      {stats.libraryGrowth && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Library Growth</CardTitle>
            <CardDescription>Your collection in {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Tracks Added</div>
                <div className="text-3xl font-bold">
                  {stats.libraryGrowth.added > 0 ? '+' : ''}
                  {stats.libraryGrowth.added.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Library Size</div>
                <div className="text-3xl font-bold">
                  {stats.libraryGrowth.total.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">tracks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
