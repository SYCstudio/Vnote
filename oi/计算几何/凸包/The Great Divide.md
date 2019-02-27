# The Great Divide
[UVA10256]

给定两个点集，判断是否存在一条直线满足两个点集恰好被直线分开。

两个点集能够分开的充要条件是两个点集的凸包无交。问题转化为求两个凸包是否有交。把一个凸包的点拿到另一个里面去判断。  
注意凸包退化的情况。

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

const int maxN=510;
const double eps=1e-8;

int n,m;
Point A[maxN],B[maxN];

Point operator + (Point A,Point B);
Point operator - (Point A,Point B);
ostream & operator << (ostream &os,Point A);
double Cross(Point A,Point B);
bool cmp(Point A,Point B);
void Convex(Point *P,int &T);
bool Intersection(Point A1,Point A2,Point B1,Point B2);
bool Inconvex(Point *C,int T,Point P);
bool Inline(Point L1,Point L2,Point A);

int main(){
    while (scanf("%d%d",&n,&m)!=EOF&&n&&m){
        for (int i=1;i<=n;i++) scanf("%lf%lf",&A[i].x,&A[i].y);
        for (int i=1;i<=m;i++) scanf("%lf%lf",&B[i].x,&B[i].y);
        Convex(A,n);Convex(B,m);
        if (n<m) swap(n,m),swap(A,B);
        A[n+1]=A[1];B[m+1]=B[1];
        if (n<=2&&m<=2){
            if (n==1&&m==1) ((A[1]-B[1]).len()<eps)?puts("No"):puts("Yes");
            else if (n==2&&m==1) (fabs((A[1]-A[2]).len()-(A[1]-B[1]).len()-(A[2]-B[1]).len())<eps)?puts("No"):puts("Yes");
            else Intersection(A[1],A[2],B[1],B[2])?puts("No"):puts("Yes");
        }
        else if (m==1) Inconvex(A,n,B[1])?puts("No"):puts("Yes");
        else if (m==2){
            if (Inconvex(A,n,B[1])||Inconvex(A,n,B[1])) puts("No");
            else{
                bool flag=1;A[n+1]=A[1];
                for (int i=1;i<=n&&flag;i++) if (Intersection(A[i],A[i+1],B[1],B[2])) flag=0;
                flag?puts("Yes"):puts("No");
            }
        }
        else{
            bool flag=1;
            for (int i=1;i<=n&&flag;i++) if (Inconvex(B,m,A[i])) flag=0;
            for (int i=1;i<=m&&flag;i++) if (Inconvex(A,n,B[i])) flag=0;
            for (int i=1;i<=n&&flag;i++) for (int j=1;j<=m&&flag;j++) if (Intersection(A[i],A[i+1],B[j],B[j+1])) flag=0;
            flag?puts("Yes"):puts("No");
        }
    }
    return 0;
}
Point operator + (Point A,Point B){
    return ((Point){A.x+B.x,A.y+B.y});
}
Point operator - (Point A,Point B){
    return ((Point){A.x-B.x,A.y-B.y});
}
ostream & operator << (ostream &os,Point A){
    os<<"("<<A.x<<","<<A.y<<")";return os;
}
double Cross(Point A,Point B){
    return A.x*B.y-A.y*B.x;
}
bool cmpc(Point A,Point B){
    return Cross(A,B)>0||(fabs(Cross(A,B))<eps&&A.len()<B.len());
}
void Convex(Point *P,int &T){
    static Point Bp[maxN];
    Point base=P[1];for (int i=2;i<=T;i++) if (P[i].y<base.y||(fabs(P[i].y-base.y)<eps&&P[i].x<base.x)) base=P[i];
    for (int i=1;i<=T;i++) P[i]=P[i]-base;sort(&P[1],&P[T+1],cmpc);
    int top=0;
    for (int i=1;i<=T;i++){
        if (top&&(P[i]-Bp[top]).len()<eps) continue;
        while (top>=2&&Cross(P[i]-Bp[top-1],Bp[top]-Bp[top-1])>=0) --top;
        Bp[++top]=P[i];
    }
    T=top;for (int i=1;i<=top;i++) P[i]=Bp[i]+base;return;
}
bool Intersection(Point A1,Point A2,Point B1,Point B2){
    if (min(A1.x,A2.x)>max(B1.x,B2.x)) return 0;
    if (min(B1.x,B2.x)>max(A1.x,A2.x)) return 0;
    if (min(A1.y,A2.y)>max(B1.y,B2.y)) return 0;
    if (min(B1.y,B2.y)>max(A1.y,A2.y)) return 0;
    return (Cross(B2-B1,A1-B1)*Cross(B2-B1,A2-B1)<eps&&Cross(A2-A1,B1-A1)*Cross(A2-A1,B2-A1)<eps)
        ||Inline(A1,A2,B1)||Inline(A1,A2,B1)||Inline(B1,B2,A1)||Inline(B1,B2,A2);
}
bool Inconvex(Point *C,int T,Point P){
    for (int i=1;i<=T;i++) if (Cross(C[i+1]-C[i],P-C[i])<0) return 0;
    return 1;
}
bool Inline(Point L1,Point L2,Point P){
    return fabs((L1-L2).len()-(L1-P).len()-(L2-P).len())<eps;
}
```