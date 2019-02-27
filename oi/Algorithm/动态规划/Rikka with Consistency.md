# Rikka with Consistency
[CFGym102012C]

On the way to the Moscow, Rikka knows someone will replace her. Who is the guy? A devil to get in touch with her dark side, or an angel to rinse the shadow off her mind? However, Rikka knows that her successor has a special name, whose meaning in Chinese is Consistency. The process of replacement is so wonderful and sentimental, which is what you all must know.  
Now, the only road from Beijing to Moscow is described as a broken line with 𝑛 segments in the 𝑋-𝐻 plane. The 𝑖-th segment connects the points (𝑖−1,ℎ𝑖−1) and (𝑖,ℎ𝑖), and ℎ0=ℎ𝑛=0 are known. This figure is a topographic map showing the whole trip from Beijing to Moscow and its 𝐻 axis indicates the altitude. The distance of a path between two points is the length of the broken line between their corresponding points in the map.  
At the outset of the trip, Rikka is in Beijing whose location in the 𝑋-𝐻 plane is (0,0); Consistency, the guy who will replace Rikka, is in Moscow which is located at (𝑛,0). Consistency always maintains consistent academic standards, a consistent life level, a consistent height of perspective and the altitude as what Rikka owns. This is why their heights are the same yesterday, today and forever.  
Now Rikka wants you to calculate the minimum total distance they need (which is the total length of paths that Rikka and Consistency travel along). By the time that Rikka arrives in Moscow and Consistency arrives in Beijing as well, their replacement will be finished (and this is the ending which is also a new beginning).

两个人的高度必须时刻一致，那么不妨以某个人到达某个顶点为分界点设计状态。设 F[i][j][0/1] 表示第一个人到达 [i,i+1) ，第二个人到达 [j,j+1) ，当前处于顶点的是那个。根据高度信息可以推理出另一个所在的具体位置。讨论这一次两人的走法来转移。  
需要一些计算几何和最短路的知识。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
#include<queue>
#include<iostream>
using namespace std;

#define sqr(x) ((x)*(x))
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=52;
const double eps=1e-8;
const double inf=1e8;
class Point{
    public:
    double x,y;
    double len(){
        return sqrt(sqr(x)+sqr(y));
    }
};
class QData{
    public:
    int opt,a,b;double d;
};

int n;
double D[2][maxN][maxN];
bool vis[2][maxN][maxN];
priority_queue<QData> Heap;
Point H[maxN];

Point operator + (Point A,Point B);
Point operator - (Point A,Point B);
Point operator * (double rate,Point A);
ostream & operator << (ostream &os,Point A);
Point GetX(Point A,Point B,double x);
Point GetY(Point A,Point B,double y);
bool operator < (QData A,QData B);
bool InRange(double l,double r,double x);
void Push(int opt,int a,int b,double cost);

int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        scanf("%d",&n);for (int i=0;i<=n;i++) scanf("%lf",&H[i].y),H[i].x=i;
        H[n+1]=((Point){n+1,0});for (int i=0;i<=n;i++) for (int j=0;j<=n;j++) D[0][i][j]=D[1][i][j]=inf;
        D[0][0][n]=0;Heap.push((QData){0,0,n,0});mem(vis,0);
        while (!Heap.empty()){
            int a=Heap.top().a,b=Heap.top().b,opt=Heap.top().opt;Heap.pop();
            if (vis[opt][a][b]) continue;vis[opt][a][b]=1;
            Point A,B;double bd=D[opt][a][b];
            if (opt==0){
                A=H[a];B=GetY(H[b],H[b+1],H[a].y);
                if ((B-H[b]).len()<eps) Push(1,a,b,bd);
                if (a!=0&&InRange(H[b].y,H[b+1].y,H[a-1].y)){
                    Point nB=GetY(H[b],H[b+1],H[a-1].y);
                    Push(0,a-1,b,bd+(A-H[a-1]).len()+(B-nB).len());
                }
                if (a!=n&&InRange(H[b].y,H[b+1].y,H[a+1].y)){
                    Point nB=GetY(H[b],H[b+1],H[a+1].y);
                    Push(0,a+1,b,bd+(A-H[a+1]).len()+(B-nB).len());
                }
                for (int aa=max(a-1,0);aa<=a;aa++){
                    if (InRange(H[aa].y,H[aa+1].y,H[b].y)){
                        Point nA=GetY(H[aa],H[aa+1],H[b].y);
                        Push(1,aa,b,bd+(A-nA).len()+(B-H[b]).len());
                    }
                    if (b!=n&&InRange(H[aa].y,H[aa+1].y,H[b+1].y)){
                        Point nA=GetY(H[aa],H[aa+1],H[b+1].y);
                        Push(1,aa,b+1,bd+(A-nA).len()+(B-H[b+1]).len());
                    }
                }
            }
            else{
                A=GetY(H[a],H[a+1],H[b].y);B=H[b];
                if ((A-H[a]).len()<eps) Push(0,a,b,bd);
                if (b!=0&&InRange(H[a].y,H[a+1].y,H[b-1].y)){
                    Point nA=GetY(H[a],H[a+1],H[b-1].y);
                    Push(1,a,b-1,bd+(A-nA).len()+(B-H[b-1]).len());
                }
                if (b!=n&&InRange(H[a].y,H[a+1].y,H[b+1].y)){
                    Point nA=GetY(H[a],H[a+1],H[b+1].y);
                    Push(1,a,b+1,bd+(A-nA).len()+(B-H[b+1]).len());
                }
                for (int bb=max(b-1,0);bb<=b;bb++){
                    if (InRange(H[bb].y,H[bb+1].y,H[a].y)){
                        Point nB=GetY(H[bb],H[bb+1],H[a].y);
                        Push(0,a,bb,bd+(A-H[a]).len()+(B-nB).len());
                    }
                    if (a!=n&&InRange(H[bb].y,H[bb+1].y,H[a+1].y)){
                        Point nB=GetY(H[bb],H[bb+1],H[a+1].y);
                        Push(0,a+1,bb,bd+(A-H[a+1]).len()+(B-nB).len());
                    }
                }
            }
        }
        printf("%.15lf\n",min(D[0][n][0],D[1][n][0]));
    }
    return 0;
}
Point operator + (Point A,Point B){
    return ((Point){A.x+B.x,A.y+B.y});
}
Point operator - (Point A,Point B){
    return ((Point){A.x-B.x,A.y-B.y});
}
Point operator * (double rate,Point A){
    return ((Point){A.x*rate,A.y*rate});
}
ostream & operator << (ostream &os,Point A){
    os<<"("<<A.x<<","<<A.y<<")";return os;
}
Point GetY(Point A,Point B,double y){
    if (fabs(A.y-B.y)<eps) return A;
    double r=(y-A.y)/(B.y-A.y);
    return A+r*(B-A);
}
bool operator < (QData A,QData B){
    return A.d>B.d;
}
bool InRange(double l,double r,double x){
    if (l>r) swap(l,r);return x<=r&&x>=l;
}
void Push(int opt,int a,int b,double cost){
    if (vis[opt][a][b]) return;
    if (D[opt][a][b]>cost) Heap.push((QData){opt,a,b,D[opt][a][b]=cost});
    return;
}
```