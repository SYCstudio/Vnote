# Segment Sum
[CF1073E]

用 0/1 变量代表某个数码是否出现过。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define pw(x) (1<<(x))
typedef long long ll;
const int Mod=998244353;
int F[20][2][pw(10)+10],G[20][2][pw(10)+10],C[pw(10)+10],K;

int Calc(ll n);
void Plus(int &x,int y);
int main(){
    for (int i=1;i<pw(10);i++) C[i]=C[i>>1]+(i&1);
    ll L,R;cin>>L>>R>>K;
    cout<<(Calc(R)-Calc(L-1)+Mod)%Mod<<endl;
    return 0;
}
int Calc(ll n){
    if (n==0) return 0;
    int len=0,Num[20];while (n) Num[++len]=n%10,n/=10;
    //for (int i=1;i<=len;i++) cout<<Num[i]<<" ";cout<<endl;
    int ret=0;
    for (int i=len;i>=1;i--){
        for (int j=1,up=(i==len?Num[len]:9);j<=up;j++){
            //cout<<i<<" "<<j<<endl;
            memset(F,0,sizeof(F));memset(G,0,sizeof(G));
            F[i][i==len&&j==Num[len]][pw(j)]=1;
            G[i][i==len&&j==Num[len]][pw(j)]=j;
            for (int k=i-1;k>=1;k--)
                for (int b=0;b<=1;b++)
                    for (int S=0;S<pw(10);S++){
                        int kf=F[k+1][b][S],kg=G[k+1][b][S];
                        if (!kf&&!kg) continue;
                        for (int p=0,uup=(b?Num[k]:9);p<=uup;p++){
                            int kb=(b==1&&p==uup);
                            Plus(F[k][kb][S|pw(p)],kf);
                            Plus(G[k][kb][S|pw(p)],(10ll*kg%Mod+1ll*p*kf%Mod)%Mod);
                        }
                    }
            for (int S=0;S<pw(10);S++)
                if (C[S]<=K)
                    //cout<<i<<" "<<j<<":"<<F[1][0][S]<<" "<<G[1][0][S]<<"|"<<F[1][1][S]<<" "<<G[1][1][S]<<endl;
                    Plus(ret,G[1][0][S]),Plus(ret,G[1][1][S]);
        }
    }
    return ret;
}
void Plus(int &x,int y){
    if (y>=Mod) y-=Mod;
    x+=y;if (x>=Mod) x-=Mod;return;
}
```