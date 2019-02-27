# Circling Round Treasures
[CF375C]

给你一个N*M的地图(N,M<=20),地图上’#’表示障碍物，’B’表示炸弹，数字表示宝藏序号（炸弹+宝藏 <=8个），每个宝藏有价值 ( -200 <= v <= 200)，'S' 表示出发点。每次移动可以从一个格子移动到相邻格子(上下左右)。寻找一条路径从’S’出发再回到’S’的封闭路径，移动步数记为K，这个路径所包围的宝藏价值总和记为V，则这条路径的价值为V-K。题目即是求可行的最大的路径价值，并且不能包围炸弹。

宝藏和炸弹的数量不超过 8 个，那自然想到状压。问题在于如何判断宝藏或者炸弹是否在封闭路境内。由计算几何的知识可知，判断一个点是否在多边形内的方法是，从这个点引出一条射线，若与多边形交点个数为奇数，则在多边形内，否则不在。那么对于宝藏和炸弹分别引射线，不妨假设为水平向右，这里状压的状态就是射线穿过多边形的奇偶性。  
注意到射线是水平向右的，即有可能存在部分与多边形边界重合。解决办法是强制在规划路径时，水平移动的路径位于格子向下一点。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=25;
const int maxM=8;
const int Fx[]={0,1,0,-1};
const int Fy[]={1,0,-1,0};
const int inf=1000000;

class QData{
    public:
    int x,y,S;
};

int n,m,stx,sty;
int Mp[maxN][maxN],tcnt=0,X[maxM],Y[maxM],Key[maxM],Tid[maxN];
char Input[maxN];
int Dp[maxN][maxN][1<<maxM];
bool inq[maxN][maxN][1<<maxM];
queue<QData> Q;

int main(){
    mem(Tid,-1);
    scanf("%d%d",&n,&m);
    for (int i=1;i<=n;i++){
        scanf("%s",Input+1);
        for (int j=1;j<=m;j++)
            if (Input[j]=='B') X[tcnt]=i,Y[tcnt]=j,Key[tcnt]=-inf,++tcnt,Mp[i][j]=1;
            else if (Input[j]=='S') stx=i,sty=j;
            else if (Input[j]=='#') Mp[i][j]=1;
            else if (Input[j]!='.') Tid[Input[j]-'0']=tcnt,X[tcnt]=i,Y[tcnt]=j,++tcnt,Mp[i][j]=1;
    }
    for (int i=1;Tid[i]!=-1;i++) scanf("%d",&Key[Tid[i]]);
    mem(Dp,63);Dp[stx][sty][0]=0;Q.push((QData){stx,sty,0});inq[stx][sty][0]=1;
    while (!Q.empty()){
        int x=Q.front().x,y=Q.front().y,S=Q.front().S;Q.pop();
        for (int f=0;f<4;f++){
            int xx=x+Fx[f],yy=y+Fy[f],SS=S;
            if (xx<=0||yy<=0||xx>n||yy>m||Mp[xx][yy]) continue;
            if (f==1) for (int i=0;i<tcnt;i++) if (X[i]==xx&&Y[i]<yy) SS^=(1<<i);
            if (f==3) for (int i=0;i<tcnt;i++) if (X[i]==x&&Y[i]<y) SS^=(1<<i);
            if (Dp[xx][yy][SS]>Dp[x][y][S]+1){
                Dp[xx][yy][SS]=Dp[x][y][S]+1;
                if (inq[xx][yy][SS]==0){
                    Q.push((QData){xx,yy,SS});
                    inq[xx][yy][SS]=1;
                }
            }
        }
        inq[x][y][S]=0;
    }
    int Ans=0;
    for (int i=0;i<(1<<tcnt);i++){
        int sum=0;
        for (int j=0;j<tcnt;j++) if (i&(1<<j)) sum+=Key[j];
        Ans=max(Ans,sum-Dp[stx][sty][i]);
    }
    printf("%d\n",Ans);return 0;
}
```