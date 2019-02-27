# Rain Protection
[CF1071E]

你需要移动一根弹性绳吸收所有的雨滴，求端点移动的最小速度  
具体而言，弹性绳的两端在$(0,0)(w,0)$和$(0,h)(w,h)$滑动，初始位置在$(e_1,0)(e_2,h)$  
$n$个雨滴会在$t_i$时刻下落在$(x_i,y_i)$，求出最小的$v$使得你移动绳子端点时，端点的速度始终不超过$v$  
如果不存在这样的$v$，输出$-1$  
要求相对误差或绝对误差不超过$10^{-4}$

注意到，若把上端点设为 x ，下断点设为 y ，能接到某一滴雨的线段的 (x,y) 呈一次函数关系。转化到平面上就是一根线段。二分速度，问题转化为，从平面上一个点出发，每次可以走切比雪夫距离不超过 vt 的一段，求是否每次都能走到指定的线段上。每次相当于是对一个线段与一个矩形作闵可夫斯基和，然后再与下一个线段判断交点。  
注意一些细节，比如多边形退化成线甚至点的情况。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
#include<iostream>
using namespace std;

#define sqr(x) ((x)*(x))

class Point{
    public:
    double x,y;
    double len(){
        return sqrt(sqr(x)+sqr(y));
    }
};

const int maxN=101000;
const double eps=1e-8;

int n,W,H;
int Ti[maxN];
Point st,P[maxN][2];

Point operator + (Point A,Point B);
Point operator - (Point A,Point B);
Point operator * (double rate,Point A);
ostream & operator << (ostream &os,Point A);
bool cmpx(Point A,Point B);
bool cmpc(Point A,Point B);
double Cross(Point A,Point B);
void Convex(Point *P,int &n);
bool Inconvex(Point *C,int n,Point p);
bool check(double dt);
bool Intersection(Point A1,Point A2,Point B1,Point B2);
Point GetIntersection(Point A1,Point A2,Point B1,Point B2);

int main(){
    scanf("%d%d%d",&n,&W,&H);
    scanf("%lf%lf",&st.x,&st.y);
    for (int i=1;i<=n;i++){
        double a,b;scanf("%d%lf%lf",&Ti[i],&a,&b);
        double rate=b/H,lx=0,rx=W,ly=0,ry=W;
        lx=max(lx,a-b*(W-a)/(H-b));
        rx=min(rx,a*b/(H-b)+a);
        ly=max(ly,a-(H-b)*(W-a)/b);
        ry=min(ry,a*(H-b)/b+a);
        P[i][0]=((Point){lx,ry});
        P[i][1]=((Point){rx,ly});
    }

    double l=0,r=W+W,Ans=-1;
    while (l+(1e-4)<r){
        double mid=(l+r)/2;
        if (check(mid)) Ans=mid,r=mid-eps;
        else l=mid+eps;
    }
    if (Ans<0) printf("-1\n");
    else printf("%.10lf\n",Ans);
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
bool cmpx(Point A,Point B){
    if (A.y!=B.y) return A.y<B.y;
    return A.x<B.x;
}
bool cmpc(Point A,Point B){
    return Cross(A,B)>0||(fabs(Cross(A,B))<eps&&A.len()<B.len());
}
double Cross(Point A,Point B){
    return A.x*B.y-A.y*B.x;
}
void Convex(Point *P,int &n){
    static Point Bp[maxN];
    sort(&P[1],&P[n+1],cmpx);
    Point base=P[1];for (int i=1;i<=n;i++) P[i]=P[i]-base;
    sort(&P[1],&P[n+1],cmpc);
    int top=0;
    for (int i=1;i<=n;i++){
        if (i!=1&&(P[i]-P[i-1]).len()<eps) continue;
        while (top>=2&&Cross(P[i]-Bp[top-1],Bp[top]-Bp[top-1])>=0) --top;
        Bp[++top]=P[i];
    }
    for (int i=1;i<=top;i++) P[i]=Bp[i]+base;
    n=top;return;
}
bool Inconvex(Point *C,int n,Point p){
    if (n==1) return ((C[1]-p).len()<eps);
    if (n==2) return fabs((C[2]-C[1]).len()-(C[2]-p).len()-(C[1]-p).len())<eps;
    for (int i=1;i<=n;i++) if (Cross(C[i+1]-C[i],p-C[i])<0) return 0;
    return 1;
}
bool check(double dt){
    Point L1=st,L2=st;
    Point F[4]={(Point){dt,dt},(Point){dt,-dt},(Point){-dt,dt},(Point){-dt,-dt}};
    for (int i=1;i<=n;i++){
        Point C[10],N[10];int cnt=0,ncnt=0;
        for (int f=0;f<4;f++) C[++cnt]=L1+(double)(Ti[i]-Ti[i-1])*F[f],C[++cnt]=L2+(double)(Ti[i]-Ti[i-1])*F[f];
        Convex(C,cnt);
        C[cnt+1]=C[1];
        for (int j=1;j<=cnt;j++)
            if (Intersection(C[j],C[j+1],P[i][0],P[i][1])){
                Point R=GetIntersection(C[j],C[j+1],P[i][0],P[i][1]);
                if (ncnt==0||(N[ncnt-1]-R).len()>eps) N[ncnt++]=R;
            }
        if (ncnt==0){
            if (Inconvex(C,cnt,P[i][0])&&Inconvex(C,cnt,P[i][1])) N[ncnt++]=P[i][0],N[ncnt++]=P[i][1];
            else if (Inconvex(C,cnt,P[i][0])) N[0]=N[1]=P[i][0],ncnt=2;
            else if (Inconvex(C,cnt,P[i][1])) N[0]=N[1]=P[i][1],ncnt=2;
            else return 0;
        }
        else if (ncnt==1){
            if (Inconvex(C,cnt,P[i][0])) N[ncnt++]=P[i][0];
            else if (Inconvex(C,cnt,P[i][1])) N[ncnt++]=P[i][1];
            else N[1]=N[0],++ncnt;
        }
        L1=N[0];L2=N[1];
    }
    return 1;
}
bool Intersection(Point A1,Point A2,Point B1,Point B2){
    if ((A1-A2).len()<eps&&(B1-B2).len()<eps) return (fabs(A1.x-B1.x)<eps)&&(fabs(A1.y-B1.y)<eps);
    if ((A1-A2).len()<eps) swap(A1,B1),swap(A2,B2);
    if ((B1-B2).len()<eps) return fabs((A1-A2).len()-(A1-B1).len()-(A2-B1).len())<eps;
    return (Cross(B2-B1,A1-B1)*Cross(B2-B1,A2-B1)<=0)&&(Cross(A2-A1,B1-A1)*Cross(A2-A1,B2-A1)<=0);
}
Point GetIntersection(Point A1,Point A2,Point B1,Point B2){
    if ((B1-B2).len()<eps&&(A1-A2).len()<eps) return A1;
    if ((A1-A2).len()<eps) return A1;
    if ((B1-B2).len()<eps) return B1;
    if ((A1-B1).len()<eps) return A1;
    if ((A1-B2).len()<eps) return A1;
    if ((A2-B1).len()<eps) return A2;
    if ((A2-B2).len()<eps) return A2;
    double t=fabs(Cross(B2-B1,A1-B1)/Cross(A2-A1,B2-B1));
    return A1+t*(A2-A1);
}
```